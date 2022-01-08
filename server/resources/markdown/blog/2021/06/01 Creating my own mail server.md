#Creating my own mail server and moving to https with my homepage
_2021/06/01 linux_  

After 15 years of using the mail service of my friend's company I've decided to create my own mail server because of a lot of reasons but mainly because if something goes wrong then the restart depends on you. So I started to learn about mail server and dns configuration and about certbot to set up https connection for both.

My domain registrar is domain.com, so the root nameservers are there. I'm using hetzner.de for server hosting and fortunately their users can use their name servers so I just had to add hetzned.de's name servers to my domain.com account and dns requests are sent there by domain.com's name servers.

My DNS records on domain.com look like this :

```
record : NS
name : @
content : ns1.domain.com

record : NS
name : @
content : ns2.domain.com

record : SOA
name : @
content : ns1.domain.com. dnsadmin.domain.com. 2021062343 10800 3600 604800 3600
```

SOA is the "start of authority" record
@ name is the current origin, milgra.com

I had to add hetzner's name servers :

```
helium.ns.hetzner.de
hydrogen.ns.hetzner.com
oxygen.ns.hetzner.com
```

Then I had to set up hetzner.de's name server for my needs, that's a little more complicated.

First set up the ipv4 address records (A) for the domain, the mail and the www subdomain :

```
record : A
name : @
value : 116.203.87.141 86400

record : A
name : mail.milgra.com
value : 78.47.127.52 86400

record : A
name : www.milgra.com
value : 116.203.87.141
```

Then repeat this for the ipv6 address (AAAA) records 

```
record : AAAA
name : @
value : 2a01:4f8:c0c:a088::1

record : AAAA
mame : mail.milgra.com
value : 2a01:4f8:c0c:2ff4::1

record : AAAA
name : www.milgra.com
value : 2a01:4f8:c0c:a088::1
```

Then comes the mail server ( MX ) record

```
record : MX
name : @
value : mail
```

First the name server and SOA records have to be added here also

```
record : NS
name : @
value : helium.ns.hetzner.de

record : NS
name : @
value : hydrogen.ns.hetzner.com

record : NS
name : @
value : oxygen.ns.hetzner.com

record : SOA
name : @
value : hydrogen.ns.hetzner.com. dns.hetzner.com. 2021062316 86400 10800 3600000 3600
```

And then I had to add the email-security hardening records, the DKIM, SPF and DMARC records.

```
record : TXT
name : _dmarc.milgra.com
value : "v=DMARC1; p=none; pct=100; rua=mailto:dmarc@milgra.com"

record : TXT
name : @
value : "v=spf1 mx ip4:78.47.127.52 ~all"

record : TXT
name : dkim._domainkey.milgra.com
value : "v=DKIM1; p=MIIBIjANBgkqhkiG9w0BAQ..." 
```

Then everything was ready to set up the mail server. I went the easy way and used the [iRedMail](www.iredmail.org) package, it installs a postfix/dovecot based mail setup with certbot-based ssl cert renewal.
The only thing was missing is restarting nginx automatically after ssl renewal, I had to add a hook in /etc/letsencrypt/cli.ini :

```
post-hook = systemctl restart nginx dovecot postfix
```

I also had to do this on my web server since a letsencrypt certificate is valid only for 2 months.

I also ran out of memory a few times and realized that the anti-virus/anti spam toolkit used by iredmail takes sometimes 2 gigabytes of memory so I simply removed it following [this](https://docs.iredmail.org/completely.disable.amavisd.clamav.spamassassin.html) tutorial.


I had to install certbot on my web server also based on the official tutorial. The only thing remained is to proxy http traffic to https since modern browsers treat http as insecure nowadays. And https is proxied to my clojure server's port. This is how nginx config looks like :

```
server {
        listen 80;
        listen [::]:80;

        server_name milgra.com www.milgra.com;

        return 301 https://$host$request_uri;
}

server {
        server_name milgra.com www.milgra.com;

        location / {
                proxy_pass http://localhost:3000;
        }

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/milgra.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/milgra.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

```