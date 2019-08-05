# Repositories

This directory contains code for repositories provided by this app. A repository is a couple <Model,Datasource>. It combines both model and datasource, and generates every database request to access it. You don't have to touch anything here, unless you want to add new model matching (e.g : User or nest, if you want to store it separatly) or a new datasource. 
Please remember that you have to declare a repository before creating any controller wich will use a model that do not have existing repository.
I strongly recommend to generate repositories using the Loopback CLI (CF Loopback documentation about CLI tools).

