# mrvn.site static sites port mapping

Server IP: `43.139.56.44`

| Domain | Host Port | Container Port | Note |
| --- | ---: | ---: | --- |
| mrvn.site | 13130 | 80 | main site default host binding |
| www.mrvn.site | 13130 | 80 | main site default host binding |
| mrvn.site | 80 | 80 | optional if `MAIN_HTTP_HOST_PORT=80` |
| www.mrvn.site | 80 | 80 | optional if `MAIN_HTTP_HOST_PORT=80` |
| claw.mrvn.site | 13131 | 13131 | static site |
| ds.mrvn.site | 13132 | 13132 | static site |
| help.mrvn.site | 13133 | 13133 | static site |
| who.mrvn.site | 13134 | 13134 | static site |
| what.mrvn.site | 13135 | 13135 | static site |
| how.mrvn.site | 13136 | 13136 | static site |
| when.mrvn.site | 13137 | 13137 | static site |
| why.mrvn.site | 13138 | 13138 | static site |
| ai.mrvn.site | 13139 | 13139 | static site |
| zww.mrvn.site | 13140 | 13140 | **required mapping** |

Access example:

- `http://mrvn.site:13130`
- `http://zww.mrvn.site:13140`
- `http://ai.mrvn.site:13139`

If host `80` is available and you start with `MAIN_HTTP_HOST_PORT=80`:

- `http://mrvn.site`
- `http://www.mrvn.site`
