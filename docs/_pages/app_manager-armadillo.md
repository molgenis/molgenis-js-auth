---
layout: page
title: Armadillo
parent: Application manager
grand_parent: Roles
nav_order: 1
permalink: /app/manager/armadillo
---

Depending on the application you are working in the role needs to comply to a specific syntax. We now have one application which is using the “FusionAuth Role Manager” which is the Armadillo.

The Armadillo adheres to the following syntax:

`#MINIO_BUCKET#`_`RESEARCHER`

> The first part of the role must match the last part of the bucket in the Minio. The last part of the role must match `_RESEARCHER` to allow users to use the DataSHIELD methods. 
> To assign superuse permissions you need to create the `SU` role and assign it to a person.

Navigate to the [Minio](https://armadillo-minio.test.molgenis.org).

Log in.

<img src="{{ site.baseurl }}/assets/images/app_storage-login.png" width="450rem"/>

Check the bucket name:

<img src="{{ site.baseurl }}/assets/images/app_storage-buckets.png" width="600rem"/>

Navigate back to the [FusionAuth Role Manager](https://armadillo-auth.test.molgens.org)

Navigate to the "Role"-tab

Create a new role.

<img src="{{ site.baseurl }}/assets/images/app_armadillo-auth-new-role.png" width="400rem"/>



