# LooForYouBackend
#### This is the repository for backend server code

public ip: 18.144.72.20


----
### ssh into server for the first time

### Using Windows Subsystem for Linux

* If you don't have bash install from here: https://docs.microsoft.com/en-us/windows/wsl/install-win10
* Download and install Ubuntu for Windows 10.
* Make sure you have the file looforyou.pem in current directory.
* From bash, type in commands

_For Loopback server:_
```
$ chown :root LooForYouLoopback.pem
$ chmod 600 LooForYouLoopback.pem
$ ssh -i LooForYouLoopback.pem ubuntu@ec2-54-183-105-234.us-west-1.compute.amazonaws.com
```

_For Mongo server:_
```
$ chown :root LooForYouMongo.pem
$ chmod 600 LooForYouMongo.pem
$ ssh -i LooForYouMongo.pem ubuntu@ec2-13-57-196-186.us-west-1.compute.amazonaws.com
```

### Using Putty

* On Putty, on Category window expand **SSH**
* Select **Auth**
* Click browse button on **Private key for authentication**
* Select the looforyou.pk file
* On Category window select **Session**
* Type **ubuntu@ec2-18-144-72-20.us-west-1.compute.amazonaws.com** for Host Name
* Make sure SSH is selected on connection type
* Click open

### Using Filezilla

* On Filezilla, under the **Edit** tab, click on **Settings**
* Select **SFTP** 
* On SFTP page, press **Add key file** button
* Locate **looforyou.ppk** file, and open it
* Press ok
* For Host type **ec2-18-144-72-20.us-west-1.compute.amazonaws.com**
* For Username type **ubuntu**
* For Port type **22**
* Press **Quickconnect** button 

**To save your login without having to type it in every time, go to File > Site Manager**

* Click on **New Site**
* Name it with a name of your choice
* In the Host box, type in **ubuntu@ec2-18-144-72-20.us-west-1.compute.amazonaws.com**
* Enter **22** for port
* Choose **SFTP** for Protocol
* Choose **Interactive** for Login Type
* Enter **ubuntu** for user
* Now every time you need to log in, go to the Site Manager Dropdown menu (located under File) and click on the saved site to connect

----

### Using Loopback CLI with Windows Subsystem for Linux

**Install Dependencies for Node, Git, and Loopback:**

```
$ sudo su
$ sudo apt-get -y update
$ sudo apt-get install git
```

**Install latest version of Node.js**

```
$ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```
_If you apt-get install without curl you will get version 0.10.x_

**Install the Loopback CLI**

```
$ sudo npm install -g loopback-cli
```

**Optional Tools: Nodemon.io**

```
$ sudo npm install -g nodemon
```

**Install the MongoDB connector for through npm**

```
$ sudo npm install loopback-connector-mongodb --save
```

The project is generated by [LoopBack](http://loopback.io).
