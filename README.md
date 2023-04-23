# QuickbaseExpressJS

This project uses ExpressJS to connect to a Quickbase CRM and add a record into the desired table.  Previously I used this app on a web form that would gather lead/client appointment data and hit a locally running node server and submit the entry.  In a production environment a few enhancements should be made before it is used including:
  - Limiting queries from a given IP, and additionally if within a single session by a certain amount of time.
  - Include captcha on your web form.
  - Blacklist repeat offending ip addresses.
  - Verifying an email address to prevent hard-bounces, this can be accomplished manually using a combination of things like writing a script to perform nslookup and email box pinging but probably best offloaded to a free use low tier solution like Mailtrap or any online email validator.
