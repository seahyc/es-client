FROM nginx:alpine
MAINTAINER Seah Ying Cong <yingcong@glints.com>

COPY nginx.conf /etc/nginx/nginx.conf
COPY es-client/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
