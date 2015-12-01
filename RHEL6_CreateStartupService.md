# Créer et Lancer un service au démarrage d'un serveur RHEL 6.7
---
1. Créer le script de démarrage dans /etc/init.d
```ssh
sudo touch /etc/init.d/myApp
sudo nano touch /etc/init.d/myApp
```

   * Copier/Coller le script suivant:
	 ```
	 #!/bin/bash
	 # myapp daemon
	 # chkconfig: 345 20 80
	 # description: myapp daemon
	 # processname: myapp

	 DAEMON_PATH="/home/wes/Development/projects"

	 DAEMON=./myapp
	 DAEMONOPTS="-my opts"

	 NAME=myapp
	 DESC="My daemon description"
	 PIDFILE=/var/run/$NAME.pid
	 SCRIPTNAME=/etc/init.d/$NAME

	 case "$1" in
	 start)
	 	printf "%-50s" "Starting $NAME..."
	 	cd $DAEMON_PATH
	 	PID=`$DAEMON $DAEMONOPTS > /dev/null 2>&1 & echo $!`
	 	#echo "Saving PID" $PID " to " $PIDFILE
	         if [ -z $PID ]; then
	             printf "%s\n" "Fail"
	         else
	             echo $PID > $PIDFILE
	             printf "%s\n" "Ok"
	         fi
	 ;;
	 status)
	         printf "%-50s" "Checking $NAME..."
	         if [ -f $PIDFILE ]; then
	             PID=`cat $PIDFILE`
	             if [ -z "`ps axf | grep ${PID} | grep -v grep`" ]; then
	                 printf "%s\n" "Process dead but pidfile exists"
	             else
	                 echo "Running"
	             fi
	         else
	             printf "%s\n" "Service not running"
	         fi
	 ;;
	 stop)
	         printf "%-50s" "Stopping $NAME"
	             PID=`cat $PIDFILE`
	             cd $DAEMON_PATH
	         if [ -f $PIDFILE ]; then
	             kill -HUP $PID
	             printf "%s\n" "Ok"
	             rm -f $PIDFILE
	         else
	             printf "%s\n" "pidfile not found"
	         fi
	 ;;

	 restart)
	   	$0 stop
	   	$0 start
	 ;;

	 *)
	         echo "Usage: $0 {status|start|stop|restart}"
	         exit 1
	 esac
	 ```
2. Copier le script de démarrage dans /etc/rc.d/init.d
```ssh
sudo cp /etc/init.d/myApp /etc/rc.d/init.d/myApp
```

3. Créer un lien logique dans /etc/rc3.d
```ssh
sudo ln -s /etc/init.d/myApp /etc/rc3.d/S[0-9][0-9]myApp
```

## Test
---
4. Redémarrer le serveur
```ssh
shutdown -r now
```

5. Tester si le service a correctement été lancé
```ssh
service myApp status
```
