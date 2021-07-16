---
layout: page
title: Application manager
parent: Roles
nav_order: 1
has_children: true 
permalink: /app/manager
---

The application manager is responsible for managing three tasks in the FusionAuth Role Manager:

- Give people access to the application
- Give people access to the data

### Give people access to the application
Before you can create roles and assign them to users you first need to register the user for this application.

#### Register users
Navigate to the [FusionAuth Role Manager](https://armadillo-auth.test.molgenis.org)

Log in.

![]({{ site.baseurl }}/assets/images/app_auth-login.png)

Click on the "Register User"-button

![]({{ site.baseurl }}/assets/images/app_auth-register.png)

Search for the specific user

<img src="{{ site.baseurl }}/assets/images/app_auth-register-search.png" width="450rem"/>

Select the user and click on "OK"

<img src="{{ site.baseurl }}/assets/images/app_auth-register-select.png" width="450rem"/>

#### Unregister users
When users are for some reason not allowed on the platform anymore. You can unregister them as well.
Click on the “Unregister User”-button and select the user you want to unregister. 

![]({{ site.baseurl }}/assets/images/app_auth-unregister-select.png)

Remove remaining roles.

![]({{ site.baseurl }}/assets/images/app_auth-unregister-roles.png)

Click on unregister.

![]({{ site.baseurl }}/assets/images/app_auth-unregister-no-roles.png)

Click on "Ok"

<img src="{{ site.baseurl }}/assets/images/app_auth-unregister-ok.png" width="300rem"/>


### Give people access to the data
Navigate to the [FusionAuth Role Manager](https://armadillo-auth.test.molgenis.org)

Log in.

![]({{ site.baseurl }}/assets/images/app_auth-login.png)

Click on the "Roles"-tab.

![]({{ site.baseurl }}/assets/images/app_auth-main.png)

Click on "Create role"

![]({{ site.baseurl }}/assets/images/app_auth-roles.png)

[Fill in the role]({{ site.baseurl }}{% link _pages/app_manager-armadillo.md %}). 

> Depending on the application you are working in the role needs to comply to a specific syntax. 
> We now have one application that is using the "FusionAuth Role Manager", which is the [Armadillo]({{ site.baseurl }}{% link _pages/app_manager-armadillo.md %}).

Click on the created role

![]({{ site.baseurl }}/assets/images/app_auth-role-select.png)

Click on "Edit members"

<img src="{{ site.baseurl }}/assets/images/app_auth-role-members.png" width="250rem"/>

Select a member and click on "Ok"

<img src="{{ site.baseurl }}/assets/images/app_auth-role-member-select.png" width="250rem"/>

Done!

![]({{ site.baseurl }}/assets/images/app_auth-role-member-assigned.png)










