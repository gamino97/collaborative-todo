import multiprocessing
import json
import datetime

workers = multiprocessing.cpu_count() * 2 + 1
bind = "0.0.0.0:5000"

accesslog = "-"
errorlog = "-"
loglevel = "info"
