"""Deterministic standard-library asset archive, portable across macOS and Linux."""
import gzip
import sys
import tarfile
from pathlib import Path
with open(sys.argv[1], 'wb') as raw:
    with gzip.GzipFile(fileobj=raw, mode='wb', filename='', mtime=0) as zipped:
        with tarfile.open(fileobj=zipped, mode='w', format=tarfile.PAX_FORMAT) as archive:
            for path in [Path('public')] + sorted(Path('public').rglob('*')):
                info = archive.gettarinfo(str(path))
                info.uid = info.gid = 0
                info.uname = info.gname = ''
                info.mtime = 1767225600
                info.pax_headers = {}
                if info.isfile():
                    with path.open('rb') as file:
                        archive.addfile(info, file)
                else:
                    archive.addfile(info)
