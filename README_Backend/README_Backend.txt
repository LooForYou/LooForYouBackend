# LooForYouBackend
#### This is the repository for backend server code

public ip: 18.144.72.20:9000


----
### ssh into server for the first time

### Using Windows 10 and Ubuntu powershell

* If you don't have bash install from here: https://docs.microsoft.com/en-us/windows/wsl/install-win10

* Download and install Ubuntu for Windows 10.

* Make sure you have the file looforyou.pem in current directory.
 
* From bash, type in commands
```
$ chown :root looforyou.pem
$ chmod 600 looforyou.pem
$ ssh -i looforyou.pem ubuntu@ec2-18-144-72-20.us-west-1.compute.amazonaws.com

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