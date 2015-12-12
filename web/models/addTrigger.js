sequelize = require('../sequelize.js');

//TODO: Drop function and confirm trigger creation works as intended.
sequelize.query('CREATE OR REPLACE FUNCTION start_job() RETURNS trigger as $$'
                + ' DECLARE'
                + ' BEGIN'
                + " PERFORM pg_notify('adna_process', 's' || NEW.id);"
                + ' RETURN new;'
                + ' END;'
                + ' $$ LANGUAGE plpgsql;');
sequelize.query('DROP TRIGGER IF EXISTS new_job on Job;')
sequelize.query('CREATE TRIGGER new_job AFTER INSERT ON Job FOR EACH ROW EXECUTE PROCEDURE start_job();');

