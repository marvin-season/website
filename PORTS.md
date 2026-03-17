# mrvn.site static sites port mapping

Server IP: `43.139.56.44`

| Domain | Host Port | Container Port | Note |
| --- | ---: | ---: | --- |
| mrvn.site | 80 | 80 | main site |
| www.mrvn.site | 80 | 80 | main site |
| claw.mrvn.site | 80 | 80 | pure static site |
| ds.mrvn.site | 80 | 80 | pure static site |
| help.mrvn.site | 80 | 80 | pure static site |
| who.mrvn.site | 80 | 80 | pure static site |
| what.mrvn.site | 80 | 80 | pure static site |
| how.mrvn.site | 80 | 80 | pure static site |
| when.mrvn.site | 80 | 80 | pure static site |
| why.mrvn.site | 80 | 80 | pure static site |
| ai.mrvn.site | 80 | 80 | pure static site |
| zww.mrvn.site | 80 | 80 | reverse proxy -> host `13140` (`http-server` dynamic service) |

Access example:

- `http://mrvn.site`
- `http://www.mrvn.site`
- `http://zww.mrvn.site`
- `http://ai.mrvn.site`
