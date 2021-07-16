---
layout: page
title: Application manager
parent: Roles
nav_order: 1
permalink: /app/manager
---

The application manager is responsible for managing three tasks in the FusionAuth Role Manager:

- Give people access to the application
- Give people access to the data

### Give people access to the application
Before you can create roles and assign them to users you first need to register the user for this application.

#### Register users
Navigate to the [FusionAuth Role Manager](https://armadillo-auth.test.molgenis.org)

Login.

![](/assets/app_auth-login.png)

Click on the "Register"-button

![](/assets/app_auth-register.png)

Search for the specific user

<img src="/assets/app_auth-register-search.png" width="450rem"/>

Select the user by clicking on the row in the table and click on "OK"

<img src="/assets/app_auth-register-select.png" width="450rem"/>

#### Unregister users
When users are for some reason not allowed on the platform anymore. You can unregister them as well. 

Select the user you want to unregister. 

![](/assets/app_auth-unregister-select.png)

Remove remaining roles.

![](/assets/app_auth-unregister-roles.png)

Click on unregister.

![](/assets/app_auth-unregister-no-roles.png)

Click on "Ok"

<img src="/assets/app_auth-unregister-ok.png" width="300rem"/>


### Give people access to the data
Navigate to the [FusionAuth Role Manager](https://armadillo-auth.test.molgenis.org)

Login.

![](/assets/app_auth-login.png)

Click on the "Roles"-tab.

![](/assets/app_auth-main.png)

Click on "Create role"

![](/assets/app_auth-roles.png)

[Fill in the role]({{ site.baseurl }}{% link _pages/app_manager-armadillo.md %}). 

> Depending on the application you are working in the role needs to comply to specific syntax. 
> We now have one application which is using the "FusionAuth Role Manager" which is the [Armadillo]({{ site.baseurl }}{% link _pages/app_manager-armadillo.md %}).

Click on the created role

![](/assets/app_auth-role-select.png)

Click on "Edit members"

<img src="/assets/app_auth-role-members.png" width="250rem"/>

Select a member and click on "Ok"

<img src="/assets/app_auth-role-member-select.png" width="250rem"/>

Done!

![](/assets/app_auth-role-member-assigned.png)










