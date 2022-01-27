### Commands to launch app at heroku

- heroku login
- git add .
- git commit -m "commit message"
- heroku create
- heroku addons:create heroku-postgresql:hobby-dev -a <"projectname">
- next you have to insert all environment variables you need in that project through cli
- heroku config:set COOKIE_KEY=supersecretcookiekey -a <"projectname">
- heroku config:set NODE_ENV=production -a <"projectname">
