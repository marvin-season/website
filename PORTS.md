# mrvn.site static sites port mapping

Server IP: `43.139.56.44`

| Domain | Host Port | Container Port | Note |
| --- | ---: | ---: | --- |
| mrvn.site | 80 | 80 | main site |
| www.mrvn.site | 80 | 80 | main site |
| what.mrvn.site | 80 | 80 | pure static site |
| zww.mrvn.site | 80 | 80 | reverse proxy -> host `13140` (`http-server` dynamic service) |

Access example:

- `http://mrvn.site`
- `http://www.mrvn.site`
- `http://what.mrvn.site`
- `http://zww.mrvn.site`
