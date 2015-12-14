#Python3
#Dependencies: psycopg, SQLAlchemy
import sys
import asyncio
import locale
import os
import json
from time import time
              
def init_conn():
  connection_string = 'postgres://postgres:test123@localhost:5432/adna'

  from sqlalchemy.ext.automap import automap_base
  from sqlalchemy.orm import Session
  from sqlalchemy.event import listens_for
  from sqlalchemy.schema import Table
  from sqlalchemy import create_engine, Column, DateTime, MetaData, Table
  from datetime import datetime

  engine = create_engine(connection_string)

  metadata = MetaData()
  metadata.reflect(engine, only=['results', 'job'])

  Table('results', metadata,
    Column('createdAt', DateTime, default=datetime.now),
    Column('updatedAt', DateTime, default=datetime.now, 
      onupdate=datetime.now),
       extend_existing=True)

  Table('job', metadata,
    Column('createdAt', DateTime, default=datetime.now),
    Column('updatedAt', DateTime, default=datetime.now,
      onupdate=datetime.now),
       extend_existing=True)

  Base = automap_base(metadata=metadata)

  Base.prepare()

  global Results, Job, session
  Results, Job = Base.classes.results, Base.classes.job

  session = Session(engine)
  
def update_progress(id, progress):
  job = Job(
    id=id,
    progress=progress
  )
  job = session.merge(job)
  session.commit()

def update_results(id, rootDir):
  resultFiles = {}

  #technically this replace *could* go wrong, but it is fairly trivial
  for (dir, _, files) in os.walk(rootDir):
      dirMinRoot = dir.replace(rootDir, '')
      insertAt = resultFiles
      if dirMinRoot:
          dirSplit = dirMinRoot.split('/')
          for dSeg in xrange(len(dirSplit) - 1):
              insertAt = insertAt[dirSplit[dSeg]]
          insertAt[dirSplit[-1]] = {}
          insertAt = insertAt[dirSplit[-1]]
      for f in files:
          path = os.path.join(dir, f)
          if os.path.exists(path):
              insertAt[f] = os.path.getsize(path)

  results = Results(
      id=id,
      base_path=rootDir,
      files=resultFiles
  )
  results = session.merge(results)
  session.commit()

def run_func(jsonStr):
  try:
    jsonLoad = json.loads(jsonStr[4:])
    func = jsonLoad['func']
    args = jsonLoad.get('args', [])
    kwargs = jsonLoad.get('kwargs', {})
    globals()[func](*args, **kwargs)
  except Exception as e:
    print('Failed to execute a function.')
    print(jsonStr)
    traceback.print_exc()
    
class SubprocessProtocol(asyncio.SubprocessProtocol):
    def pipe_data_received(self, fd, data):
        if fd == 1:
            name = 'stdout'
        elif fd == 2:
            name = 'stderr'
        text = data.decode(locale.getpreferredencoding(False))
        if text[0:4] == "$#! ":
          run_func(text)
        print('Received from {}: {}'.format(name, text.strip()))

    def process_exited(self):
        print('Subprocess finished')

@asyncio.coroutine
def dbListener():
  import select
  import psycopg2
  import psycopg2.extensions

  conn = psycopg2.connect(database="adna", user="postgres", password="test123", host="localhost")
  conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)

  curs = conn.cursor()
  curs.execute("LISTEN adna_process;")

  print("Waiting for notifications on channel 'adna_process'")
  while 1:
    if select.select([conn],[],[],5) == ([],[],[]):
      print("Timeout")
    else:
      conn.poll()
      while conn.notifies:
        notify = conn.notifies.pop(0)
        print("Got NOTIFY:", notify.pid, notify.channel, notify.payload)
        if notify.payload[0] == "s":
          loop.create_task(loop.subprocess_exec(SubprocessProtocol, 
        "python3.5", "simul.py", notify.payload[1:]))
    yield from asyncio.sleep(10)

def main():
  init_conn()
  global loop
  loop = asyncio.get_event_loop()
  loop.create_task(dbListener())
  loop.run_forever()

if __name__ == '__main__':
    main()
    
test = '$#! {"args": ["3", "/root/ancient-dna/sampleResults/"], "func": "update_results", "kwargs": {}}'