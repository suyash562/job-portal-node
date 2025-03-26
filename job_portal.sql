

select * from job_portal_user;
select * from job_portal_user_profile;
select * from job_portal_employee_company;

--truncate table job_portal_user_profile
-- alter table job_portal_user_profile drop column phoneNumber;
-- alter table job_portal_user_profile drop UQ_ef5c4f511eebc4b26468ee89ac6

--insert into job_portal_user values('admin@gmail.com', 'Admin@123', 'admin');
insert into job_portal_user_profile values('first', 'last', 'Admin Address', '', 'admin@gmail.com', '9999999999');