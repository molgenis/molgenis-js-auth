# Add roles to Armadillo users
The permission manager of the Armadillo allows you to manage and assign roles to the users in the authentication server of your consortium.

## Users
When you have applications to perform research on your data, you need to be able to authenticate in the Armadillo.

The first step is register new users that are present in the network of the consortia.

![register-user](Users-Register_User.png)

To view all users registered in your Armadillo instance you start with the screen below.

![users](Users.png)


## Roles
When you created new folders in the Armadillo storage server you need to create corresponding roles for the folders.

Example folders in the Armadillo are:

- all
- asthma
- diabetes

There are 2 types of roles:

- Superuser role
  Can access and manage all the data in the armadillo storage server
- Researcher role --> #folder_#RESEARCHER
  Can perform DataSHIELD analysis on the corresponding folder

Example of roles for the example folders should be:

- SU
  Superuser manages the "all"  
- ASTHMA_RESEARCHER
  Can perform DataSHIELD analysis on the "asthma" folder
- DIABETES_RESEARCHER
  Can perform DataSHIELD analysis on the "diabetes" folder

The screenshot below shows the possible roles in this example.

![roles](Roles.png)

### Add new roles
When you add new roles to the Aramdillo you need to make sure that the new role is based on one of the folders in the Armadillo. So if you add a new folder:

- exampledata

The role for the researcher should be:

- exampledata_RESEARCHER

Adding new roles is easy.

![add-role](Roles-Create_New_Role.png)

### Rename existing roles
If you made an error in adding a new role you can update it to the correct name.

![edit-role](Roles-Create_New_Role.png)

## Managing users and roles
There are several ways to manage the roles assigned to the users. At this moment we support perspecitve

- roles perspective
- user perspective

### Roles perspective
You can manage users per role in the roles perspective. You can easily edit members for each role.

![edit-role-members](Roles-Edit_Members.png)

## User perspective
You view and manage which users have permissions to access, analyse or manage your data.

![edit-uses-roles](Users-Edit_User_Roles.png)