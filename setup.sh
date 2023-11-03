export Appname=transferswaps
export Domain=transferswaps.xyz


# https://github.com/cli/cli/blob/trunk/docs/install_linux.md



# install nodejs
sudo apt update
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
nvm list-remote
nvm install lts/hydrogen


npm i pm2 -g
npm i nodemon -g
node -v

mkdir data
# install LAMP
sudo -- sh -c 'apt update && apt upgrade'
sudo apt-get update
sudo apt-get install apache2 php libapache2-mod-php php-gd php-mysql libapache2-mod-wsgi-py3
sudo apt install apache2
sudo ufw allow in "WWW Full"
sudo ufw allow www
sudo ufw allow https
sudo ufw status

sudo ufw allow 1000/tcp
sudo ufw allow 3306/tcp
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp
sudo ufw allow 3002/tcp
sudo ufw allow 3003/tcp
sudo ufw allow 3004/tcp
sudo ufw allow 3005/tcp
sudo ufw allow 3006/tcp





# https://www.digitalocean.com/community/tutorials/how-to-set-up-apache-virtual-hosts-on-ubuntu-18-04
sudo mkdir -p /root/$Appname/build
sudo chown -R $USER:$USER /root/$Appname/build
sudo chmod -R 755 /root/$Appname/build
sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/$Domain.conf

sudo a2dissite 000-default.conf
sudo a2ensite $Domain.conf

sudo a2dissite $Domain.conf
sudo a2ensite 000-default.conf

sudo service apache2 restart
sudo service apache2 status





# https://www.digitalocean.com/community/tutorials/how-to-use-apache-http-server-as-reverse-proxy-using-mod_proxy-extension
a2enmod proxy
a2enmod proxy_http
a2enmod proxy_ajp
a2enmod rewrite
a2enmod deflate
a2enmod headers
a2enmod proxy_balancer
a2enmod proxy_connect
a2enmod proxy_html

cd /etc/apache2/sites-available
# thêm các dòng sau vào file $Domain.conf 
		# ServerName $Domain
		# ServerAlias www.$Domain

		# ProxyPreserveHost On
		# ProxyPass / http://0.0.0.0:3000/
		# ProxyPassReverse / http://0.0.0.0:3000/
sudo service apache2 restart






# hướng dẫn cài ssl https://serverspace.io/support/help/how-to-get-lets-encrypt-ssl-on-ubuntu/

# để cài ssl 
# b1. 
apt install python3-certbot-apache
sudo a2enmod ssl
sudo a2enmod rewrite
# b2. 
sudo service apache2 stop
sudo certbot certonly --standalone --agree-tos --preferred-challenges http -d $Domain -d *.$Domain
sudo service apache2 start
sudo certbot --apache --agree-tos --preferred-challenges http -d $Domain -d *.$Domain
sudo service apache2 status

# b3. 
# copy file default-ssl.conf ->  $Domain-ssl.conf 
cp  /etc/apache2/sites-available/default-ssl.conf /etc/apache2/sites-available/$Domain-ssl.conf 
# sửa nội dung : copy proxy, ServerName, ServerAlias,... trong file  $Domain.conf vào $Domain-ssl.conf 
# sửa đường dẫn tới private key
		# SSLCertificateFile	/etc/letsencrypt/live/$Domain/fullchain.pem
		# SSLCertificateKeyFile /etc/letsencrypt/live/$Domain/privkey.pem
sudo a2ensite $Domain-ssl.conf
sudo service apache2 restart





sudo apt install mariadb-server
mysql -u root -p
sudo mysql_secure_installation

# public database
sudo iptables -A INPUT -p tcp --destination-port 3306 -j ACCEPT
sudo iptables -A INPUT -p tcp --destination-port 1000 -j ACCEPT
sudo iptables -A INPUT -p tcp --destination-port 3000 -j ACCEPT
sudo iptables -A INPUT -p tcp --destination-port 3001 -j ACCEPT
sudo ufw allow 3306/tcp

# start service
sudo service mariadb start 
sudo service mariadb status 

# import database 
mysql -u muser -p usdtransfer < database.sql

# backup database
mysqldump usdtransfer > database.sql 