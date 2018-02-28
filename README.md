# LooForYouBackend
#### This is the repository for backend server code

public ip: 18.144.72.20:9000


----
### ssh into server for the first time

##### If you don't have bash install from here:
https://docs.microsoft.com/en-us/windows/wsl/install-win10
 
##### Download and install Ubuntu for Windows 10.
Make sure you have the file looforyou.pem in current directory.

#### Download the pem file
1. open up bash from directory where the .pem file is

2. From bash, type in commands:

```
$ chown :root looforyou.pem
$ chmod 600 looforyou.pem

$ ssh -i looforyou.pem ubuntu@ec2-18-144-72-20.us-west-1.compute.amazonaws.com
```