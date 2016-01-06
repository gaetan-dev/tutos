# iisnode
Installer une API Node sous un IIS

## Configuration des appels à l'API
Les requêtes http doivent être dirigées sur le port ISS

## Configuration du serveur ISS
### Paramétrage du serveur
#### Role Services
Server Manager > Roles > Web Server (IIS) > Add Role Services > Security
Cocher "Basic Authentication" et "Windows Authentication"

### Installation des composants
#### Node.js
#### Git
#### Installer le module iis-node
https://github.com/tjanczuk/iisnode

## Déploiement de l'API Node
Copier/Coller votre API Node (MyApp) dans C://inetpub/MyApp
### Web.config
Ajouter à la racine de votre projet le fichier Web.config suivant: 
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
		<handlers>
            <add name="iisnode" path="app.js" verb="*" modules="iisnode" />
	   </handlers>
        <defaultDocument>
            <files>
                <add value="app.js" />
            </files>
        </defaultDocument>
		<!-- Necessary for redirecting ISS requests to Node -->
        <rewrite>
		  <rules>
			<rule name="myapp">
			  <match url="/*" />
			  <action type="Rewrite" url="app.js" />
			</rule>
		  </rules>
		</rewrite>
    </system.webServer>
</configuration>
```

## Déploiement du serveur ISS
### ApplicationPool
#### Création de l'utilisateur myUser
Server Manager > Configuration > Local Users and Groups > Users > New User...
Cocher "Password never expires"

#### Ajout du groupe ISS_IUSRS
Server Manager > Configuration > Local Users and Groups > Groups > IIS_IUSRS > Add to Group...
Ajouter myUser

#### Permissions
Donner la permission "Full control" au dossier parent de votre projet
C://inetpub > Properties > Security 

#### Création de l'ApplicationPool myPool
Internet Information Services (IIS) Manager > Application Pools > Add Application Pool...
.NET Framework Version: v4.0
Managed Pipeline Mode: Integrated
Identity: myUSer

### Ajout du projet à IIS
Internet Information Services (IIS) Manager > Sites > Add Web Site...
Application Pool: myPool
Physical Path: C://inetpub/myApp

#### app.js document par défaut
Internet Information Services (IIS) Manager > Sites > Footer > Default Document > Add...
name: app.js
