# mrvn.site static sites port mapping

Server IP: `43.139.56.44`

| Domain | Host Port | Container Port | Note |
| --- | ---: | ---: | --- |
| mrvn.site | 80 | 80 | main site |
| www.mrvn.site | 80 | 80 | main site |
| claw.mrvn.site | 80 | 80 | reverse proxy -> host `13131` |
| ds.mrvn.site | 80 | 80 | reverse proxy -> host `13132` |
| help.mrvn.site | 80 | 80 | reverse proxy -> host `13133` |
| who.mrvn.site | 80 | 80 | reverse proxy -> host `13134` |
| what.mrvn.site | 80 | 80 | reverse proxy -> host `13135` |
| how.mrvn.site | 80 | 80 | reverse proxy -> host `13136` |
| when.mrvn.site | 80 | 80 | reverse proxy -> host `13137` |
| why.mrvn.site | 80 | 80 | reverse proxy -> host `13138` |
| ai.mrvn.site | 80 | 80 | reverse proxy -> host `13139` |
| zww.mrvn.site | 80 | 80 | reverse proxy -> host `13140` |

Access example:

- `http://mrvn.site`
- `http://www.mrvn.site`
- `http://zww.mrvn.site`
- `http://ai.mrvn.site`
