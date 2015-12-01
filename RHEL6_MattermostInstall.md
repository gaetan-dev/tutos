# Mattermost production installation on RHEL 6.7
---
## YUM configuration
---
#### VM windows
1. Tools/Connections/"Fiddler listens on port": 8888
2. In Fiddler check Tools/Connections/"Allow remote computers to connect"
3. Restart Fiddler

#### Linux Server
1. Using yum with a Proxy Server
```ssh
nano /etc/yum.conf
```
Configuring Proxy Server Access
```ssh
proxy=http://vm.windows.ip.machine:8888
```

2. Add pgsql yum local repository
```ssh
yum localinstall http://yum.postgresql.org/9.4/redhat/rhel-6-x86_64/pgdg-centos94-9.4-1.noarch.rpm
```

3. Add nginx yum local repository
```ssh
touch /etc/yum.repos.d/nginx.repo
nano /etc/yum.repos.d/nginx.repo
```
Add
```ssh
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/rhel/6/x86_64/
gpgcheck=0
enabled=1
```

## Set up Database Server
---

1. Install PostgreSQL 9.3+
```ssh
sudo yum install postgresql94 postgresql94-contrib postgresql94-server
```

2. Add user postgres
```ssh
sudo adduser postgres
```

3. Initialize the database
```ssh
service postgresql-9.4 initdb
```

4. Start Postgres
```ssh
service postgresql-9.4 start
```

5. PostgreSQL created a user account called postgres. You will need to log into that account with:
```ssh
sudo -i -u postgres
```

6. You can get a PostgreSQL prompt by typing:
```ssh
psql
```

7. Create the Mattermost database by typing:
```ssh
postgres=# CREATE DATABASE mattermost;
```

8. Create the Mattermost user by typing:
```ssh
postgres=# CREATE USER mmuser WITH PASSWORD 'mmuser_password';
```

9. Grant the user access to the Mattermost database by typing:
```ssh
postgres=# GRANT ALL PRIVILEGES ON DATABASE mattermost to mmuser;
```

10. You can exit out of PostgreSQL by typing:
```ssh
postgre=# \q
```

11. You can exit the postgres account by typing:
```ssh
exit
```

12. Allow Postgres to listen on all assigned IP Addresses
```ssh
sudo nano /var/lib/pgsql/9.4/data/postgresql.conf
```
Uncomment 'listen_addresses' and change 'localhost' to *

13. Alter pg_hba.conf to allow the mattermost server to talk to the postgres database
```ssh
sudo nano /var/lib/pgsql/9.4/data/pg_hba.conf
```
Add the following line to the 'IPv4 local connections'
```
local	all	all           trust
host  all	127.0.0.1/32	trust
```

14. Reload Postgres database
```ssh
sudo /etc/init.d/postgresql-9.4 reload
```

15. Startup postgresql
```ssh
/sbin/chkconfig --level 3 postgresql-9.4 on
```

## Set up Mattermost Server
---

1. Download in the current VM:
https://github.com/mattermost/platform/releases/download/v1.2.1/mattermost.tar.gz

2. Copy mattermost.tar.gz to server /tmp
In the cmder client:
```ssh
scp Downloads/mattermost.tar.gz s622888adm@DVAFAVMODWBT04.siege.pp.axa-fr.intraxa:/tmp
```

3. Unzip the Mattermost Server by typing:
```ssh
tar -xvzf mattermost.tar.gz
```

4. Move the mattermost directory to /opt
```ssh
mv mattermost /opt/
```

5. Create the storage directory for files. We assume you will have attached a large drive for storage of images and files. For this setup we will assume the directory is located at /mattermost/data.
* Create the directory by typing:
```ssh
sudo mkdir -p /opt/mattermost/data
```

* Set the ubuntu account as the directory owner by typing:
```ssh
sudo chown -R ubuntu /opt/mattermost
```

6. Configure Mattermost Server by editing the config.json file at /home/ubuntu/mattermost/config`
Edit the file by typing:
```ssh
nano /opt/mattermost/config/config.json
```

replace
```ssh
DriverName": "mysql" with DriverName": "postgres"
```

replace
```ssh
"DataSource": "mmuser:mostest@tcp(dockerhost:3306)/mattermost_test?charset=utf8mb4,utf8" with "DataSource": "postgres://mmuser:mmuser_password@10.10.10.1:5432/mattermost?sslmode=disable&connect_timeout=10"
```

7. Test the Mattermost Server
```ssh
cd /opt/mattermost/bin
```

Run the Mattermost Server by typing:
```ssh
sudo ./platform
```

You should see a console log like Server is listening on :8065 letting you know the service is running.
Stop the server for now by typing ctrl-c

8. Setup Mattermost to use the Ubuntu Upstart daemon which handles supervision of the Mattermost process.
```ssh
sudo touch /etc/init/mattermost.conf
sudo nano /etc/init/mattermost.conf
```

Copy the following lines into /etc/init/mattermost.conf
```
start on runlevel [2345]
stop on runlevel [016]
respawn
chdir /opt/mattermost
setuid root
exec bin/platform
```

You can manage the process by typing:
```ssh
sudo start mattermost
```

Verify the service is running by typing:
```ssh
curl http://server.redhat.ip.machine:8065
```

You should see a page titles Mattermost - Signup
You can also stop the process by running the command
```ssh
sudo stop mattermost
```

, but we will skip this step for now.

## Set up Nginx Server
---

1. We use Nginx for proxying request to the Mattermost Server. The main benefits are:
  * SSL termination
  * http to https redirect
  * Port mapping :80 to :8065
  * Standard request logs

2. Install Nginx
```ssh
sudo yum install nginx
```

3. Start Nginx
```ssh
sudo service nginx start
```

4. Verify Nginx is running
```ssh
curl http://server.redhat.ip.machine
```
You should see a Welcome to nginx! page

5. Configure Nginx to proxy connections from the internet to the Mattermost Server
```ssh
cd /etc/nginx/conf.d
```
Create a configuration for Mattermost
```ssh
sudo touch mattermost.conf
```

Below is a sample configuration with the minimum settings required to configure Mattermost

```
 server {
    location / {
        client_max_body_size 50M;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header   X-Frame-Options   SAMEORIGIN;
        proxy_pass http://localhost:8065;
    }
}
```

Rename the existing file conf with

```ssh
sudo mv default.conf default.conf.old
```

6. Configure SELinux to accept httpd openning socket
```ssh
/usr/sbin/setsebool -P httpd_can_network_connect 1
```

7. Restart Nginx service
```ssh
service nginx restart
```
