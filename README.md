# Floreat — Single EC2 Deployment Guide (Beginner Friendly)

This guide walks you through deploying the **Floreat** application on a **single AWS
EC2 instance**, with **PostgreSQL running on the same server**. It assumes you have
**never used AWS or a Linux server before**, so every step is spelled out: what each
command does, why it is needed, what output to expect, and how to confirm it worked.

> **Scope for this phase (as requested):**
> - Everything runs on **one** EC2 instance: the Node.js app **and** PostgreSQL.
> - We keep the **Clerk development** keys (`pk_test_...` / `sk_test_...`). We do **not**
>   set up Clerk production keys or a custom Clerk domain.
> - We **ignore** domains, DNS, SSL/TLS and HTTPS. The app will be reachable over
>   plain **HTTP** at your instance's public IP address. You will add HTTPS later.

---

## Table of contents

1. [How the pieces fit together (architecture)](#1-architecture)
2. [AWS account prerequisites](#2-prerequisites)
3. [Create and configure the EC2 instance](#3-create-ec2)
4. [Security Group configuration (every rule explained)](#4-security-group)
5. [Connect to the instance with SSH](#5-ssh)
6. [Update the server and install base tools](#6-update-server)
7. [Install and configure Node.js](#7-nodejs)
8. [Install PostgreSQL](#8-install-postgres)
9. [Create the database, user and permissions](#9-database)
10. [Clone the project from GitHub](#10-clone)
11. [Configure environment variables](#11-env)
12. [Install project dependencies](#12-deps)
13. [Run Prisma migrations and generate the client](#13-prisma)
14. [Build the application for production](#14-build)
15. [Keep the app alive with PM2](#15-pm2)
16. [Install and configure Nginx as a reverse proxy](#16-nginx)
17. [Firewall and security best practices](#17-firewall)
18. [Automatic startup after reboot](#18-startup)
19. [Verify the application works](#19-verify)
20. [Troubleshooting common problems](#20-troubleshooting)
21. [Basic server maintenance](#21-maintenance)

---

<a name="1-architecture"></a>
## 1. How the pieces fit together (architecture)

Floreat is a monorepo with three parts (npm workspaces):

- **`frontend/`** — a React + Vite app. When built, it becomes a folder of **static
  files** (HTML/CSS/JS). It talks to the backend by calling paths that start with
  `/api`.
- **`backend/`** — a Fastify (Node.js) API server that listens on **port 3000**. It
  talks to PostgreSQL and validates users with Clerk.
- **`shared/`** — TypeScript code (validation + calculations) shared by both. It must
  be **built first** so the other two can import the compiled output.

On the single EC2 instance, the request flow looks like this:

```
                          EC2 instance (Ubuntu Linux)
                 ┌────────────────────────────────────────────────┐
   Your          │                                                 │
   browser  ──►  │  Nginx  (port 80, public)                       │
  (HTTP 80)      │    │                                            │
                 │    ├── "/"      → serves built frontend files    │
                 │    │             (frontend/dist, static HTML/JS) │
                 │    │                                            │
                 │    └── "/api/*" → proxied to Node backend        │
                 │                    (127.0.0.1:3000, PM2-managed) │
                 │                          │                       │
                 │                          ▼                       │
                 │                   PostgreSQL (127.0.0.1:5432)     │
                 │                   (only reachable locally)        │
                 └────────────────────────────────────────────────┘
```

**Why this shape?**

- **Nginx** is the only thing exposed to the internet (port 80). It is fast at serving
  static files and safely forwards API calls to Node. This is called a **reverse
  proxy**.
- The **Node backend** listens only on `127.0.0.1` (localhost) via Nginx. Users never
  hit port 3000 directly.
- **PostgreSQL** listens only on `127.0.0.1` too, so the database is **never exposed to
  the internet** — a key security property.
- Because Nginx serves the frontend **and** proxies `/api` on the **same origin**, the
  frontend's `VITE_API_URL` is left **empty**, so browser calls become relative
  `/api/...` requests. This also avoids CORS problems for the frontend itself.

**Process manager (PM2):** Node apps stop when you log out or the server reboots. **PM2**
keeps the backend running in the background and restarts it automatically after a reboot
or a crash.

Keep this picture in mind — every section below builds one box in this diagram.

---

<a name="2-prerequisites"></a>
## 2. AWS account prerequisites

Before touching EC2, make sure you have the following.

### 2.1 An AWS account
- Go to <https://aws.amazon.com/> and click **Create an AWS Account**.
- You must provide an email, a password, and a **credit/debit card** (AWS verifies it
  with a small temporary charge). New accounts include a **Free Tier** for 12 months.
- Complete the phone/identity verification.

**Why:** EC2 and all other services live inside your AWS account; there is no way to
launch a server without one.

### 2.2 Sign in as a safer user (recommended, not mandatory for this phase)
The email you signed up with is the **root user**. AWS recommends you avoid daily use of
root. For a first deployment you *can* use root, but if you want to follow best practice:
- Open the **IAM** service → **Users** → **Create user** → give it
  **AdministratorAccess** → sign in with that user instead.

**Why:** The root user can do anything, including closing the account and changing
billing. Limiting its use reduces the blast radius if a password leaks.

### 2.3 Pick a Region
In the top-right corner of the AWS console there is a **Region** selector (e.g.
`Asia Pacific (Mumbai) ap-south-1`, `US East (N. Virginia) us-east-1`).
- Choose the region **closest to your users** and **stick with it** for every step.

**Why:** EC2 instances, key pairs, and security groups are **region-specific**. If you
create a key pair in one region and launch the instance in another, they won't be
visible to each other and you'll be confused.

### 2.4 A GitHub account with access to the repo
The project lives at `https://github.com/yaseen-kc/floreat.git`.
- If the repo is **public**, no extra setup is needed.
- If it is **private**, you'll need a **Personal Access Token** (covered in
  [Section 10](#10-clone)).

### 2.5 Set a billing alarm (strongly recommended)
- Open **Billing and Cost Management** → **Budgets** → **Create budget** → set a small
  monthly amount (e.g. `$5`) and your email.

**Why:** So you get an email before any surprise charges. The Free Tier is generous but
easy to exceed if you leave large instances running.

**Verify this section:** You can log into the AWS console, you see a Region name in the
top-right, and you can open the **EC2** service from the top search bar.


---

<a name="3-create-ec2"></a>
## 3. Create and configure the EC2 instance

**EC2** (Elastic Compute Cloud) is a virtual server (a "virtual machine") that you rent
from AWS. We will launch one running **Ubuntu Linux**.

### 3.1 Open the launch wizard
1. In the AWS console search bar, type **EC2** and open it.
2. Confirm your **Region** (top-right) is the one you chose in Section 2.3.
3. Click the orange **Launch instance** button.

### 3.2 Name the instance
- **Name:** `floreat-server` (any name is fine; it's just a label).

**Why:** So you can identify it later in a list of instances.

### 3.3 Choose the OS image (AMI)
- Under **Application and OS Images**, select **Ubuntu**.
- Choose **Ubuntu Server 24.04 LTS** (or the latest LTS shown). Make sure it says
  **"Free tier eligible"**.

**Why:** Ubuntu LTS ("Long Term Support") is beginner-friendly, widely documented, and
supported for years. This guide's commands (`apt`) assume Ubuntu.

### 3.4 Choose the instance type (size)
- Select **t3.small** (2 vCPU, 2 GB RAM) if you can, otherwise **t2.micro / t3.micro**
  (1 GB RAM, Free-tier eligible).

**Why:** Building the frontend with Vite and running Node + PostgreSQL together needs
memory. On a 1 GB `t2.micro` the build **can run out of memory and fail**. If you must
use `t2.micro`, we add a **swap file** in [Section 6.4](#6-update-server) to compensate.
`t3.small` is not free but costs only a few dollars/month and avoids that pain.

### 3.5 Create a key pair (this is how you log in)
1. Under **Key pair (login)**, click **Create new key pair**.
2. **Name:** `floreat-key`.
3. **Key pair type:** `RSA`.
4. **Private key file format:**
   - `.pem` → for macOS/Linux terminal and modern Windows PowerShell/OpenSSH.
   - `.ppk` → only if you plan to use the PuTTY app on Windows.
   - Choose **`.pem`** unless you specifically use PuTTY.
5. Click **Create key pair**. Your browser downloads `floreat-key.pem`.

> **Save this file carefully.** It is the *only* key to your server and AWS does **not**
> keep a copy. If you lose it, you lose SSH access. Move it somewhere safe, e.g.
> `C:\Users\<you>\.ssh\floreat-key.pem` on Windows.

**Why:** Linux servers on AWS use **key-based SSH login** instead of passwords. The
private key on your computer proves who you are; the matching public key is placed on the
server automatically.

### 3.6 Network settings (we'll refine the firewall next)
- Under **Network settings**, click **Edit**.
- Leave the default **VPC** and **Subnet**.
- **Auto-assign public IP:** **Enable**. (This gives the server a public address so you
  can reach it.)
- Under **Firewall (security groups)**, choose **Create security group** and give it the
  name `floreat-sg`. We configure its exact rules in [Section 4](#4-security-group);
  for now allow SSH so you can connect.

### 3.7 Configure storage
- Set the root volume to **20 GiB**, type **gp3**.

**Why:** The default 8 GiB fills up quickly once you add Node, PostgreSQL, `node_modules`,
and logs. 20 GiB gp3 is cheap and gives breathing room.

### 3.8 Launch
- Review the summary on the right, then click **Launch instance**.
- Click **View all instances**. Within a minute the **Instance state** becomes
  **Running** and **Status checks** become **2/2 checks passed**.

**Expected result:** One instance named `floreat-server`, state **Running**, with a
**Public IPv4 address** shown in its details (e.g. `13.234.56.78`). **Write this IP
down** — you'll use it repeatedly.

> **Note on the IP:** By default this public IP **changes every time you stop/start** the
> instance. If you only ever *reboot* (not stop) it stays. To get a permanent IP later,
> allocate an **Elastic IP** (EC2 → Elastic IPs → Allocate → Associate with the
> instance). Optional for this phase.

**Verify this section:** In EC2 → **Instances**, your instance shows **Running**,
**2/2 checks passed**, and a **Public IPv4 address**.

---

<a name="4-security-group"></a>
## 4. Security Group configuration (every rule explained)

A **Security Group** is a **virtual firewall** wrapped around your instance. It controls
which network traffic is allowed **in** (inbound) and **out** (outbound). It is
"deny by default": anything you don't explicitly allow is blocked.

Open **EC2 → Instances → select `floreat-server` → Security tab → click the security
group (`floreat-sg`) → Edit inbound rules**.

### 4.1 Inbound rules to create

| # | Type       | Protocol | Port | Source              | Why it exists |
|---|------------|----------|------|---------------------|----------------|
| 1 | SSH        | TCP      | 22   | **My IP**           | So *you* can log in to administer the server. Restricting to *My IP* means only your current internet address can even attempt to connect. |
| 2 | HTTP       | TCP      | 80   | **Anywhere (0.0.0.0/0)** | So anyone's browser can load the app. Nginx listens here and serves the frontend + proxies `/api`. |

**How to add each rule:** click **Add rule**, pick the **Type** (which auto-fills the
port), then set the **Source**:
- For SSH choose **My IP** from the Source dropdown — AWS fills in your current address.
- For HTTP choose **Anywhere-IPv4** (`0.0.0.0/0`).

Click **Save rules**.

### 4.2 Ports we deliberately do NOT open

| Port | Service | Why we keep it closed |
|------|---------|------------------------|
| **3000** | Node backend | Users must go through Nginx (port 80). Exposing 3000 would bypass the proxy and reveal the app server directly — unnecessary attack surface. |
| **5432** | PostgreSQL | The database must **never** be reachable from the internet. It only accepts connections from the app on the same machine (`127.0.0.1`). Opening 5432 is one of the most common and dangerous misconfigurations. |
| **443** | HTTPS | We are skipping SSL this phase. You'll open 443 when you add HTTPS later. |

**Key idea:** The backend and database talk to each other *inside* the instance over
`localhost`. That internal traffic **does not** pass through the Security Group, so we
don't need to open 3000 or 5432 at all.

### 4.3 Outbound rules
Leave the **default outbound rule** (All traffic, Anywhere) as-is.

**Why:** The server needs to reach out to the internet to download OS updates, npm
packages, and to contact **Clerk's** authentication servers. Outbound is allowed by
default and is safe here.

### 4.4 A note about "My IP" changing
Home/office internet IPs change over time. If SSH suddenly stops working with a timeout,
your IP probably changed — come back here, edit rule #1, and re-select **My IP**.

**Verify this section:** Inbound rules list exactly **SSH (22) from your IP** and
**HTTP (80) from anywhere**. No rule for 3000, 5432, or 443.

---

<a name="5-ssh"></a>
## 5. Connect to the instance with SSH

**SSH** (Secure Shell) gives you a remote command-line on the server. You authenticate
with the `floreat-key.pem` file you downloaded.

The username for Ubuntu AMIs is always **`ubuntu`**. The command shape is:

```
ssh -i <path-to-key> ubuntu@<public-ip>
```

### 5.1 On Windows (PowerShell — recommended)
Windows 10/11 include OpenSSH. First, tighten the key file's permissions (SSH refuses to
use a key that other users can read):

```powershell
# Move to where your key is, e.g. your Downloads or .ssh folder:
cd $env:USERPROFILE\.ssh

# Lock down the key file so only your account can read it:
icacls floreat-key.pem /inheritance:r
icacls floreat-key.pem /grant:r "$($env:USERNAME):(R)"
```

**What this does:** `icacls /inheritance:r` removes inherited permissions; the `/grant:r`
line gives *only you* read access. **Why:** OpenSSH rejects a private key that is
world-readable with an "UNPROTECTED PRIVATE KEY FILE" error.

Now connect (replace the IP with your instance's Public IPv4):

```powershell
ssh -i floreat-key.pem ubuntu@13.234.56.78
```

### 5.2 On macOS / Linux

```bash
chmod 400 ~/.ssh/floreat-key.pem       # make the key readable only by you
ssh -i ~/.ssh/floreat-key.pem ubuntu@13.234.56.78
```

### 5.3 First connection prompt
The first time you'll see:

```
The authenticity of host '13.234.56.78' can't be established.
ED25519 key fingerprint is SHA256:...
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

Type **`yes`** and press Enter. This is normal — your computer is remembering the
server's identity so it can warn you if it ever changes.

**Expected output (success):** A welcome banner and a new prompt that looks like:

```
Welcome to Ubuntu 24.04 LTS ...
ubuntu@ip-172-31-xx-xx:~$
```

That `ubuntu@ip-...:~$` prompt means **you are now typing commands on the server**, not
on your own computer. Every command from here on runs on the EC2 instance unless stated
otherwise.

**Verify this section:** Run `whoami` — it prints `ubuntu`. Run `hostname -I` — it prints
the server's internal IP(s). You're in.

> **Troubleshooting a failed connect:**
> - *Connection timed out* → Security Group SSH rule doesn't include your current IP
>   (Section 4.4), or you used the wrong Public IP.
> - *Permission denied (publickey)* → wrong key file, or you used a username other than
>   `ubuntu`.
> - *UNPROTECTED PRIVATE KEY FILE* → redo the permission commands in 5.1 / 5.2.


---

<a name="6-update-server"></a>
## 6. Update the server and install base tools

You are now on the server (prompt shows `ubuntu@...`). Ubuntu uses **`apt`** as its
package manager (think "app store for the command line"). `sudo` runs a command with
administrator ("root") privileges.

### 6.1 Refresh the package lists and upgrade

```bash
sudo apt update
sudo apt upgrade -y
```

- **`sudo apt update`** downloads the latest list of available package versions. It does
  **not** install anything yet.
  - *Expected output:* lines like `Hit:1 ...`, `Get:2 ...`, ending with
    `... packages can be upgraded. Run 'apt list --upgradable' to see them.`
- **`sudo apt upgrade -y`** installs the newest versions of already-installed packages.
  `-y` auto-answers "yes". **Why:** security patches and bug fixes.
  - *Expected output:* a list of upgraded packages, then it returns to the prompt.

> If you ever see a purple screen about "restarting services" or a "kernel upgrade",
> press **Enter**/**Tab** to accept defaults. If it says a reboot is required, run
> `sudo reboot`, wait ~30s, then SSH in again.

### 6.2 Install common tools

```bash
sudo apt install -y git curl ca-certificates gnupg build-essential
```

- **`git`** — to clone the project from GitHub.
- **`curl`** — to download install scripts.
- **`ca-certificates`, `gnupg`** — let the system verify signed software repositories
  (needed for the Node.js repo in Section 7).
- **`build-essential`** — a C/C++ compiler toolchain. Some npm packages compile native
  code during install; without this they fail.
- *Verify:* `git --version` and `curl --version` each print a version number.

### 6.3 (Optional) Set the server's timezone

```bash
sudo timedatectl set-timezone Asia/Kolkata   # change to your timezone
```

**Why:** So log timestamps match your local time. Use `timedatectl list-timezones` to
find yours. Purely cosmetic.

### 6.4 Add swap space (do this if you chose t2.micro / 1 GB RAM)
Swap is disk space used as "overflow" when RAM fills up. It prevents the frontend build
from being killed for running out of memory on small instances.

```bash
sudo fallocate -l 2G /swapfile          # create a 2 GB file
sudo chmod 600 /swapfile                # only root can read/write it
sudo mkswap /swapfile                   # format it as swap
sudo swapon /swapfile                   # enable it now
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab   # keep it after reboot
```

- *Verify:* run `free -h`. Under the **Swap** row you should now see `2.0Gi` total.

**Why each line:** `fallocate` reserves the space; `chmod 600` secures it; `mkswap`
prepares the swap structure; `swapon` activates it; the `fstab` line re-enables it
automatically on every boot. On a `t3.small` (2 GB RAM) swap is optional but harmless.

**Verify this section:** `free -h` shows memory (and swap if you added it), and
`git --version` works.

---

<a name="7-nodejs"></a>
## 7. Install and configure Node.js

The app needs **Node.js** (the JavaScript runtime) and **npm** (its package manager).
We install **Node.js 22 LTS** from NodeSource, which gives a current, supported version
(Ubuntu's built-in Node is usually too old for this project's tooling).

### 7.1 Add the NodeSource repository and install

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

- The **first command** downloads NodeSource's setup script and runs it. It registers
  their software repository and refreshes `apt`. `-E` preserves your environment; the
  trailing `-` tells bash to read the script from the pipe.
  - *Expected output:* messages ending with something like
    `Repository configured successfully. To install Node.js, run: apt install nodejs -y`.
- The **second command** installs Node.js **and** npm together.

### 7.2 Verify

```bash
node -v
npm -v
```

- *Expected output:* `node -v` prints `v22.x.x`; `npm -v` prints `10.x.x` or `11.x.x`.

**Why LTS:** "Long Term Support" versions get security fixes for years and match what the
project's dependencies (Fastify 5, Prisma 7, Vite 8) expect.

### 7.3 Confirm npm workspaces are understood
This project is an **npm workspaces monorepo** (root `package.json` lists `shared`,
`backend`, `frontend`). npm 8+ supports workspaces natively, so the Node 22 install above
is sufficient — no extra tooling needed.

**Verify this section:** `node -v` shows v22, `npm -v` shows a 10/11 version.

---

<a name="8-install-postgres"></a>
## 8. Install PostgreSQL

Floreat stores its data in **PostgreSQL**. We install it **on this same instance** and
keep it bound to `localhost` so it is never exposed to the internet.

### 8.1 Install the server

```bash
sudo apt install -y postgresql postgresql-contrib
```

- **`postgresql`** — the database server and its command-line client (`psql`).
- **`postgresql-contrib`** — a set of useful extra extensions.
- *Expected output:* apt installs several packages and, on Ubuntu, **automatically starts
  the database** and enables it on boot.

### 8.2 Confirm it is running

```bash
sudo systemctl status postgresql
```

- *Expected output:* a block containing **`active (exited)`** or **`active (running)`** in
  green. Press **`q`** to exit the status view.
- If it is not active: `sudo systemctl enable --now postgresql` starts it and sets it to
  launch on every boot.

**What `systemctl` is:** the tool that manages background services ("daemons") on Ubuntu.
You'll use it for PostgreSQL, Nginx, and PM2's startup service.

### 8.3 Check the version and that it listens locally

```bash
psql --version
sudo ss -tlnp | grep 5432
```

- *Expected output:* `psql (PostgreSQL) 16.x` (or similar), and a line showing something
  listening on `127.0.0.1:5432`. **This confirms PostgreSQL is bound to localhost only**,
  exactly what we want — combined with the closed Security Group port 5432, the database
  is unreachable from the internet.

**Verify this section:** `sudo systemctl status postgresql` shows **active**, and
`psql --version` prints a version.

---

<a name="9-database"></a>
## 9. Create the database, user and permissions

Installing PostgreSQL created an admin OS user called **`postgres`**. We'll use it once to
create:
- a **database** named `floreat`,
- a **database user (role)** named `floreat_user` with a password,
- the right **permissions** for that user on that database.

### 9.1 Open a database shell as the postgres admin

```bash
sudo -u postgres psql
```

- **What it does:** `sudo -u postgres` runs the `psql` client as the `postgres` admin
  user (which is trusted locally without a password). You are now inside the PostgreSQL
  prompt, which looks like `postgres=#`.

### 9.2 Create the user, database and permissions
Type these **one line at a time** at the `postgres=#` prompt. **Replace
`CHANGE_ME_STRONG_PASSWORD`** with your own strong password and remember it — you'll put
it in the app's config in Section 11.

```sql
CREATE USER floreat_user WITH PASSWORD 'CHANGE_ME_STRONG_PASSWORD';
CREATE DATABASE floreat OWNER floreat_user;
GRANT ALL PRIVILEGES ON DATABASE floreat TO floreat_user;
\c floreat
GRANT ALL ON SCHEMA public TO floreat_user;
ALTER SCHEMA public OWNER TO floreat_user;
\q
```

Line by line:
- **`CREATE USER ... WITH PASSWORD ...`** — creates the login role the app will use.
  *Expected output:* `CREATE ROLE`.
- **`CREATE DATABASE floreat OWNER floreat_user`** — creates the database and makes our
  user its owner. *Expected output:* `CREATE DATABASE`.
- **`GRANT ALL PRIVILEGES ON DATABASE floreat TO floreat_user`** — lets the user connect
  and manage the database. *Expected output:* `GRANT`.
- **`\c floreat`** — connects to (switches into) the `floreat` database. *Expected
  output:* `You are now connected to database "floreat" as user "postgres".`
- **`GRANT ALL ON SCHEMA public ...` / `ALTER SCHEMA public OWNER ...`** — on PostgreSQL
  15+ a fresh database's `public` schema is locked down by default. These two lines let
  `floreat_user` **create tables** there. **Why it matters:** Prisma migrations
  (Section 13) create tables in `public`; without this they fail with a
  "permission denied for schema public" error.
- **`\q`** — quits `psql` and returns you to the normal shell.

> **Password rules:** use a long password with letters, numbers and symbols. Avoid `@`,
> `:`, `/`, and spaces if possible — they are special characters in a database URL and
> would need percent-encoding in Section 11. A long alphanumeric password sidesteps that.

### 9.3 Verify the user can actually log in
Test the exact credentials the app will use:

```bash
psql "postgresql://floreat_user:CHANGE_ME_STRONG_PASSWORD@127.0.0.1:5432/floreat" -c "SELECT current_user, current_database();"
```

- *Expected output:* a small table showing `current_user = floreat_user` and
  `current_database = floreat`, then it returns to the shell.
- If you get **`password authentication failed`**, the password here doesn't match what
  you set in 9.2 — re-run `sudo -u postgres psql` and
  `ALTER USER floreat_user WITH PASSWORD 'new_password';`.

**Why this test:** it proves password login over TCP works *before* you wire it into the
app, so if something's wrong you know it's the database, not the app.

**Verify this section:** The `SELECT current_user...` command returns `floreat_user` /
`floreat` with no error.


---

<a name="10-clone"></a>
## 10. Clone the project from GitHub

We'll put the code in your home directory (`/home/ubuntu`).

### 10.1 Clone

```bash
cd ~
git clone https://github.com/yaseen-kc/floreat.git
cd floreat
```

- **`cd ~`** moves to your home directory (`~` means `/home/ubuntu`).
- **`git clone ...`** downloads the whole repository into a new `floreat/` folder.
- **`cd floreat`** enters the project.
- *Expected output:* `Cloning into 'floreat'...` followed by progress lines, ending back
  at a prompt. `ls` now shows `backend  frontend  shared  package.json ...`.

### 10.2 If the repository is private
The clone above will ask for a username/password and fail on the password (GitHub no
longer accepts account passwords over HTTPS). Instead:
1. On GitHub → your avatar → **Settings** → **Developer settings** → **Personal access
   tokens** → **Tokens (classic)** → **Generate new token** with the **`repo`** scope.
2. Copy the token (starts with `ghp_...`).
3. Clone using the token as the password:
   ```bash
   git clone https://github.com/yaseen-kc/floreat.git
   # Username: yaseen-kc
   # Password: paste the ghp_... token
   ```

**Why a token:** it's a scoped, revocable credential — safer than a password and required
by GitHub for HTTPS git operations.

### 10.3 Confirm you're on the right branch

```bash
git branch --show-current
git log --oneline -1
```

- *Expected output:* the current branch name (e.g. `main`) and the most recent commit.

**Verify this section:** `ls ~/floreat` lists `backend`, `frontend`, `shared`, and
`package.json`.

---

<a name="11-env"></a>
## 11. Configure environment variables

**Environment variables** are settings the app reads at runtime (and, for the frontend,
at *build* time). They hold secrets (DB password, Clerk keys) and settings (port, allowed
origins) that must **not** be hard-coded. The repo ships `.env.example` files documenting
every key — we create real `.env` files from them.

> **First, get your server's public IP handy.** From the AWS console (EC2 → Instances →
> Public IPv4), e.g. `13.234.56.78`. You'll use it below. From now on this doc writes it
> as **`YOUR_EC2_IP`** — substitute your real IP everywhere.

### 11.1 Backend environment file
Create `backend/.env`:

```bash
cd ~/floreat
nano backend/.env
```

`nano` is a simple text editor. Paste the following, **editing the two placeholders**
(`YOUR_DB_PASSWORD` and `YOUR_EC2_IP`):

```env
# --- Database (local PostgreSQL from Section 9) ---
DATABASE_URL="postgresql://floreat_user:YOUR_DB_PASSWORD@127.0.0.1:5432/floreat"

# --- Clerk (KEEP the development keys for this phase) ---
CLERK_PUBLISHABLE_KEY=pk_test_cmFyZS1jb3JnaS01LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_ZFg4NcyR295fFTDTbE69qs4LwINZPFOqdjQfl8RV46

# --- Server ---
NODE_ENV=production
PORT=3000

# --- CORS: exact origin the browser uses to reach the app (no trailing slash) ---
CORS_ORIGIN=http://YOUR_EC2_IP

# --- Rate limiting (safe defaults) ---
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=1 minute
```

Save and exit nano: press **Ctrl+O**, then **Enter** (to write), then **Ctrl+X** (to
exit).

**What each key does / why it's needed:**
- **`DATABASE_URL`** — how Prisma/Node connects to PostgreSQL. `127.0.0.1` = the local DB
  we set up. If your DB password contains special characters (`@ : / ? #`), you must
  percent-encode them here (e.g. `@` → `%40`). This is why Section 9.2 recommended an
  alphanumeric password.
- **`CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY`** — authenticate users via Clerk. We
  keep the **`pk_test_` / `sk_test_`** *development* keys exactly as requested. (These are
  the values already in the repo's `backend/.env`.)
- **`NODE_ENV=production`** — tells the app it's a real deployment. **Important:** the
  backend's config *requires* a non-empty, non-`*` `CORS_ORIGIN` when `NODE_ENV` is
  `production`, or it will refuse to start (a deliberate security check). That's why the
  next line is mandatory.
- **`PORT=3000`** — the port the backend listens on (Nginx will forward `/api` here).
- **`CORS_ORIGIN=http://YOUR_EC2_IP`** — the browser origin allowed to call the API with
  credentials. Since Nginx serves the app on `http://YOUR_EC2_IP` (port 80, so no
  `:80` needed), that exact string must be listed. **No trailing slash.** No wildcard
  (`*`) — the app rejects it because credentials + `*` is insecure.
- **`RATE_LIMIT_*`** — throttles abusive request volume. Defaults are fine.

### 11.2 Frontend environment file
Create `frontend/.env`:

```bash
nano frontend/.env
```

Paste:

```env
# Leave VITE_API_URL EMPTY: Nginx serves the app and proxies /api on the SAME origin,
# so the browser makes relative "/api/..." calls. (See frontend/.env.example.)
VITE_API_URL=

# Clerk publishable key — development key, same as the backend's.
VITE_CLERK_PUBLISHABLE_KEY=pk_test_cmFyZS1jb3JnaS01LmNsZXJrLmFjY291bnRzLmRldiQ
```

Save and exit (**Ctrl+O**, **Enter**, **Ctrl+X**).

**Why `VITE_API_URL` is empty:** Vite bakes this value into the built JavaScript at
**build time**. Empty means the frontend calls `/api/...` on whatever origin served it —
which is exactly our Nginx setup. If you ever change it, you must **rebuild** the
frontend (Section 14) for the change to take effect.

> **Security note:** `.env` files hold secrets. They're already git-ignored, so they
> won't be committed. Never paste real secret keys into public places.

**Verify this section:** `cat backend/.env` and `cat frontend/.env` show your values, and
`DATABASE_URL` contains your real password and `127.0.0.1:5432/floreat`.

---

<a name="12-deps"></a>
## 12. Install project dependencies

Install all packages for all three workspaces in one go from the repo root.

```bash
cd ~/floreat
npm install
```

- **What it does:** because the root `package.json` declares workspaces, a single
  `npm install` at the root installs dependencies for `shared`, `backend`, and
  `frontend`, and links the local `@floreat/shared` package into the other two.
- *Expected output:* a progress spinner, then a summary like
  `added 1234 packages in 45s`. Some `npm warn` lines are normal. There should be **no**
  `npm error` lines.
- *Duration:* 1–3 minutes depending on instance size.

> **If `npm install` is killed / hangs on t2.micro:** it ran out of memory. Make sure you
> added swap (Section 6.4), then retry.

**Verify this section:** `ls node_modules` lists many folders, and
`ls node_modules/@floreat/shared` exists (the workspace link).

---

<a name="13-prisma"></a>
## 13. Run Prisma migrations and generate the client

**Prisma** is the tool the backend uses to talk to PostgreSQL. Two things must happen:
1. **Generate the Prisma client** — code that lets the app query the DB in a type-safe
   way.
2. **Apply migrations** — run the SQL that creates all the tables in your empty `floreat`
   database.

All Prisma commands run from the **`backend`** folder because that's where the Prisma
schema (`prisma/schema.prisma` for the generator/datasource config, plus `prisma/models/`
for the models and enums) and the migrations live. They read `DATABASE_URL` from
`backend/.env`.

### 13.1 Generate the Prisma client

```bash
cd ~/floreat/backend
npm run db:generate
```

- **What it does:** runs `prisma generate`, producing the client into
  `backend/generated/prisma`.
- *Expected output:* `✔ Generated Prisma Client ... in ...ms`.

### 13.2 Apply migrations to create the tables

```bash
npm run db:migrate:deploy
```

- **What it does:** runs `prisma migrate deploy`, which applies **all committed
  migrations** in order to your database. This is the **production-safe** migration
  command — unlike `migrate dev`, it never tries to generate new migrations or reset
  data.
- *Expected output:* a list of the migrations found and
  `Applying migration ...` lines, ending with something like
  `All migrations have been successfully applied.` (or, if somehow already applied,
  `No pending migrations to apply.`).

> **Why `migrate deploy` and not `migrate dev`:** `migrate dev` is for development — it
> can prompt, create migrations, and even reset the database. On a server you always use
> `migrate deploy`, which only applies existing migrations.

### 13.3 (Optional) Seed sample data
The project includes a seed script. Run it **only if** you want demo data:

```bash
npm run db:seed
```

- *Expected output:* log lines from the seed script, ending without an error. Skip this
  if you want a clean, empty database.

### 13.4 Verify the tables exist

```bash
psql "postgresql://floreat_user:YOUR_DB_PASSWORD@127.0.0.1:5432/floreat" -c "\dt"
```

- *Expected output:* a table listing showing your models (e.g. `User`, `Job`, `Roof`,
  `Canopy`, `Mezzanine`, `Stair`, `Load`, `Accessories`, plus Prisma's
  `_prisma_migrations`). If you see **"Did not find any relations"**, the migration
  didn't run — re-check 13.2 and the `DATABASE_URL`.

**Verify this section:** `\dt` lists application tables and `_prisma_migrations`.

---

<a name="14-build"></a>
## 14. Build the application for production

"Building" turns the TypeScript/React source into optimized files that run fast in
production:
- **`shared`** → compiled JS the other two import (must build first).
- **`backend`** → compiled JS in `backend/dist` (run with `node dist/server.js`).
- **`frontend`** → static files in `frontend/dist` (served by Nginx).

The root `build` script does **all three in the correct order**:

```bash
cd ~/floreat
npm run build
```

- **What it does:** runs `build:shared`, then the frontend build (`tsc -b && vite build`),
  then the backend build (`tsc` → `dist`).
- *Expected output:* per-workspace output. The frontend prints a Vite table of emitted
  assets ending with `✓ built in ...s`. No red `error TS...` lines should appear.
- *Duration:* 1–3 minutes. On low-RAM instances this is the step most likely to fail for
  memory reasons — ensure swap is enabled (Section 6.4).

### 14.1 Verify the build outputs exist

```bash
ls ~/floreat/backend/dist/server.js
ls ~/floreat/frontend/dist/index.html
```

- *Expected output:* both paths print (no "No such file or directory"). These two files
  are what PM2 (backend) and Nginx (frontend) will serve.

### 14.2 Quick smoke test of the backend (optional but reassuring)

```bash
cd ~/floreat/backend
node dist/server.js
```

- *Expected output:* Fastify logs like
  `{"level":30,...,"msg":"Server listening at http://127.0.0.1:3000"}` (or `0.0.0.0:3000`).
- In **another** SSH window (or after stopping), test it:
  ```bash
  curl -i http://127.0.0.1:3000/api/jobs
  ```
  You'll likely get **`401 Unauthorized`** — that's a **success signal**: the server is
  up and the auth layer is protecting the route. A `Connection refused` would mean it
  isn't running.
- Stop this manual run with **Ctrl+C**. (PM2 will run it properly in the next section.)

**Verify this section:** `backend/dist/server.js` and `frontend/dist/index.html` both
exist; the manual `node dist/server.js` boots and `curl` reaches it.


---

<a name="15-pm2"></a>
## 15. Keep the app alive with PM2

If you run `node dist/server.js` by hand, it stops the moment you close SSH or the server
reboots. **PM2** is a process manager that runs the backend in the background, restarts it
if it crashes, and (via Section 18) brings it back after a reboot.

### 15.1 Install PM2 globally

```bash
sudo npm install -g pm2
```

- **`-g`** installs it system-wide so the `pm2` command is available everywhere.
- *Verify:* `pm2 -v` prints a version number.

### 15.2 Start the backend under PM2

```bash
cd ~/floreat/backend
pm2 start dist/server.js --name floreat-api
```

- **What it does:** launches `dist/server.js` as a managed process named `floreat-api`.
  It reads `backend/.env` because the file sits in this working directory and the app
  loads env vars at startup.
- *Expected output:* a table listing `floreat-api` with status **`online`**.

> **Make sure env vars are loaded.** The compiled backend expects the environment to be
> present. Because you start PM2 from `~/floreat/backend`, and the process reads its
> config from `process.env`, the simplest robust approach is to have PM2 load the file
> explicitly. If your `pm2 start` above shows the app crashing with a `CORS_ORIGIN` or
> `DATABASE_URL` error, start it this way instead:
> ```bash
> pm2 delete floreat-api
> pm2 start dist/server.js --name floreat-api --node-args="--env-file=/home/ubuntu/floreat/backend/.env"
> ```
> `--env-file` makes Node load every key from your `.env` before the app runs.

### 15.3 Check it's healthy

```bash
pm2 status
pm2 logs floreat-api --lines 20
```

- *Expected output:* `pm2 status` shows `floreat-api` **online** with a low restart
  count. `pm2 logs` shows Fastify's `Server listening at http://127.0.0.1:3000`. Press
  **Ctrl+C** to leave the log view.
- If status shows **`errored`** or the restart count climbs quickly, read the logs — the
  most common causes are a wrong `DATABASE_URL` password or a missing `CORS_ORIGIN`
  (Section 20).

### 15.4 Confirm it answers locally

```bash
curl -i http://127.0.0.1:3000/api/jobs
```

- *Expected output:* HTTP headers with **`401 Unauthorized`** (auth is working) — proof
  the backend is live behind PM2.

**Useful PM2 commands (reference):**
- `pm2 restart floreat-api` — restart after a code change/rebuild.
- `pm2 stop floreat-api` — stop it.
- `pm2 delete floreat-api` — remove it from PM2's list.
- `pm2 logs floreat-api` — live logs.
- `pm2 monit` — live CPU/memory dashboard.

**Verify this section:** `pm2 status` shows `floreat-api` **online**, and the local
`curl` returns 401.

---

<a name="16-nginx"></a>
## 16. Install and configure Nginx as a reverse proxy

**Nginx** is the public front door (port 80). It will:
- serve the built **frontend** static files from `frontend/dist`, and
- forward any request starting with **`/api`** to the backend at `127.0.0.1:3000`.

### 16.1 Install Nginx

```bash
sudo apt install -y nginx
```

- *Expected output:* apt installs Nginx and starts it. Visit `http://YOUR_EC2_IP` in your
  browser now and you'll see the default **"Welcome to nginx!"** page — proof port 80 and
  the Security Group HTTP rule work. We'll replace that page next.

### 16.2 Create the site configuration
Create a new config file:

```bash
sudo nano /etc/nginx/sites-available/floreat
```

Paste this **exactly** (replace `YOUR_EC2_IP` with your real IP):

```nginx
server {
    listen 80;
    server_name YOUR_EC2_IP;

    # Where the built frontend lives (static files).
    root /home/ubuntu/floreat/frontend/dist;
    index index.html;

    # 1) API requests → Node backend on localhost:3000.
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 2) Everything else → the React app. Unknown paths fall back to index.html
    #    so client-side routing (react-router) works on page refresh.
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Save and exit (**Ctrl+O**, **Enter**, **Ctrl+X**).

**What each part does / why:**
- **`listen 80`** — accept plain HTTP (the only port we opened).
- **`root .../frontend/dist` + `index index.html`** — serve the compiled frontend.
- **`location /api/ { proxy_pass ... }`** — forward API calls to the Node backend. The
  `proxy_set_header` lines pass along the real client IP and protocol so the backend logs
  and rate-limiter see the true visitor, not Nginx.
- **`location / { try_files ... /index.html }`** — for any non-file URL (e.g.
  `/quotations/new`), serve `index.html` so React Router can handle the route. Without
  this, refreshing a deep link would 404.

> **Why this matches the app's config:** the frontend was built with `VITE_API_URL` empty,
> so it calls **relative** `/api/...` URLs on the same origin. Nginx catching `/api/` and
> proxying it to `:3000` is exactly what makes that work — and it's why we didn't need to
> open port 3000 in the firewall.

### 16.3 Let Nginx read the frontend files
Nginx runs as the `www-data` user and must be able to traverse into your home directory
to read `frontend/dist`. Grant execute (traverse) permission on the path:

```bash
sudo chmod o+x /home/ubuntu
sudo chmod -R o+rX /home/ubuntu/floreat/frontend/dist
```

- **Why:** by default `/home/ubuntu` may not be enterable by other users, causing Nginx
  to return **403 Forbidden**. `o+x` lets others *traverse* the folder (not list it);
  `o+rX` lets them *read* the built files. This exposes only the already-public frontend
  bundle, nothing sensitive.

### 16.4 Enable the site and disable the default

```bash
sudo ln -s /etc/nginx/sites-available/floreat /etc/nginx/sites-enabled/floreat
sudo rm /etc/nginx/sites-enabled/default
```

- **First line** enables your site by symlinking it into `sites-enabled`.
- **Second line** removes the "Welcome to nginx!" default so it doesn't compete with your
  site.

### 16.5 Test the config and reload

```bash
sudo nginx -t
sudo systemctl reload nginx
```

- **`nginx -t`** checks your config for syntax errors **before** applying it.
  - *Expected output:* `syntax is ok` and `test is successful`. If it reports an error,
    it tells you the file and line — fix it and re-test.
- **`systemctl reload nginx`** applies the new config with zero downtime.
  - *Expected output:* none (silent success). Confirm with `sudo systemctl status nginx`
    showing **active (running)**.

**Verify this section:** In your browser, open `http://YOUR_EC2_IP` — you should now see
the **Floreat app**, not the Nginx welcome page. (Full verification in Section 19.)

---

<a name="17-firewall"></a>
## 17. Firewall and security best practices

You now have two firewall layers available: the AWS **Security Group** (Section 4) and an
optional on-host firewall, **UFW**. We'll enable UFW as defense-in-depth and review a few
hardening steps.

### 17.1 Enable the UFW host firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx HTTP'
sudo ufw --force enable
sudo ufw status verbose
```

- **`allow OpenSSH`** — keep port 22 open so you don't lock yourself out. **Do this
  first.**
- **`allow 'Nginx HTTP'`** — open port 80 for the web app.
- **`--force enable`** — turn the firewall on without an interactive prompt.
- *Expected output of `status verbose`:* `Status: active` and rules allowing
  `22/tcp (OpenSSH)` and `80/tcp (Nginx HTTP)`. Note that ports **3000** and **5432** are
  **not** listed — they stay blocked from outside, while `localhost` traffic between
  Nginx→Node and Node→PostgreSQL is unaffected (loopback is always allowed).

> **Two firewalls, same rules:** the Security Group blocks at the AWS network edge; UFW
> blocks on the host itself. Keeping both in sync (only 22 + 80 inbound) is belt-and-
> suspenders security.

### 17.2 Confirm the database is not internet-facing
Re-confirm PostgreSQL binds only to localhost:

```bash
sudo ss -tlnp | grep 5432
```

- *Expected output:* it listens on `127.0.0.1:5432` (and possibly `::1:5432`), **never**
  `0.0.0.0:5432`. Combined with the closed firewall port, the DB is safe. If you ever see
  `0.0.0.0:5432`, edit `listen_addresses` in
  `/etc/postgresql/*/main/postgresql.conf` back to `localhost` and
  `sudo systemctl restart postgresql`.

### 17.3 General best practices (checklist)
- **Keep the system patched:** run `sudo apt update && sudo apt upgrade -y` periodically
  (Section 21).
- **SSH is key-only:** Ubuntu AMIs already disable password SSH login. Don't re-enable it.
- **Restrict SSH source:** keep the Security Group SSH rule scoped to **My IP**, not
  `0.0.0.0/0`.
- **Protect secrets:** `backend/.env` holds your DB password and Clerk secret. It's
  git-ignored and readable only within your account. Don't print it in shared logs.
- **Least privilege DB user:** `floreat_user` owns only the `floreat` database, nothing
  else on the server.
- **Rate limiting is on:** the backend uses `@fastify/rate-limit` and security headers via
  `@fastify/helmet` — already configured, nothing to do.

> **Reminder (per your instructions):** we are intentionally **not** setting up HTTPS/SSL
> yet. Until you do, traffic between the browser and the server is unencrypted — fine for
> this phase, but add TLS (e.g. Let's Encrypt via Certbot) before real users/production
> data.

**Verify this section:** `sudo ufw status` shows **active** with only 22 and 80 allowed;
`ss -tlnp | grep 5432` shows localhost binding only.

---

<a name="18-startup"></a>
## 18. Automatic startup after reboot

Servers occasionally reboot (updates, AWS maintenance, or you running `sudo reboot`). We
need **PostgreSQL**, **Nginx**, and the **PM2-managed backend** to all come back
automatically.

### 18.1 PostgreSQL and Nginx (already automatic)
Both were enabled on install. Confirm:

```bash
sudo systemctl is-enabled postgresql nginx
```

- *Expected output:* `enabled` printed for each. If either says `disabled`, run
  `sudo systemctl enable postgresql` / `sudo systemctl enable nginx`.

### 18.2 Make PM2 (the backend) start on boot

```bash
pm2 startup systemd
```

- **What it does:** prints a **`sudo env PATH=... pm2 startup systemd -u ubuntu --hp
  /home/ubuntu`** command. **Copy that exact line it prints and run it.** This registers
  PM2 as a systemd service that launches at boot.
- *Expected output:* after running the printed command, a message like
  `[PM2] Init System found: systemd` and `Freeze a process list on reboot via: pm2 save`.

### 18.3 Save the current process list

```bash
pm2 save
```

- **What it does:** snapshots the currently running processes (`floreat-api`) so PM2 knows
  what to resurrect on boot.
- *Expected output:* `[PM2] Saving current process list...` and
  `[PM2] Successfully saved ...`.

### 18.4 Test a full reboot (recommended)

```bash
sudo reboot
```

- Your SSH session drops (expected). Wait ~30–60 seconds, reconnect
  (`ssh -i ... ubuntu@YOUR_EC2_IP`), then check everything came back:

```bash
pm2 status
sudo systemctl status nginx postgresql --no-pager
curl -i http://127.0.0.1:3000/api/jobs
```

- *Expected output:* `floreat-api` **online**, Nginx and PostgreSQL **active**, and the
  `curl` returns **401** — meaning the whole stack self-recovered after reboot.

**Verify this section:** After `sudo reboot`, the app is reachable at `http://YOUR_EC2_IP`
without you starting anything manually.


---

<a name="19-verify"></a>
## 19. Verify the application works

Let's confirm the whole chain end-to-end: browser → Nginx → (frontend + backend) → DB.

### 19.1 Frontend loads

- Open **`http://YOUR_EC2_IP`** in your browser.
- *Expected:* the Floreat UI loads (login/sign-in screen or the app shell), **not** the
  Nginx welcome page and **not** a blank/error page.
- If blank, open the browser **DevTools → Console** (F12) and check for errors
  (Section 20 covers the common ones).

### 19.2 API is reachable through Nginx (same origin)
From your **local machine** (or the server), test the proxied path:

```bash
curl -i http://YOUR_EC2_IP/api/jobs
```

- *Expected output:* HTTP **`401 Unauthorized`** with a JSON body. This is the correct,
  healthy response for a protected route hit without a token — it proves:
  1. Nginx received the request on port 80,
  2. matched `/api/` and proxied it to the Node backend,
  3. the backend ran and enforced auth.
- A `502 Bad Gateway` means Nginx is up but the backend isn't reachable (see Section 20).

### 19.3 Authentication (Clerk) works
- On the frontend, click **Sign in / Sign up** and complete a Clerk flow.
- *Expected:* since we're using Clerk **development** keys, the dev sign-in works and you
  reach the authenticated part of the app.
- Once signed in, perform an action that reads/writes data (e.g. open the jobs/quotations
  list or create one). If data loads and saves, the **frontend → API → PostgreSQL** path
  is fully working.

### 19.4 Data really persists in PostgreSQL
After creating something in the UI, confirm it landed in the DB:

```bash
psql "postgresql://floreat_user:YOUR_DB_PASSWORD@127.0.0.1:5432/floreat" -c "SELECT count(*) FROM \"Job\";"
```

- *Expected output:* a count that increases as you create jobs in the app. (Table names
  are quoted because Prisma uses capitalized names.)

**Verify this section:** frontend loads over HTTP, `/api/jobs` returns 401 unauthenticated,
Clerk dev sign-in succeeds, and created data appears in PostgreSQL.

---

<a name="20-troubleshooting"></a>
## 20. Troubleshooting common problems

For any issue, your first three diagnostic commands are:

```bash
pm2 logs floreat-api --lines 50            # backend application errors
sudo tail -n 50 /var/log/nginx/error.log   # Nginx / proxy errors
sudo journalctl -u postgresql -n 50        # database service errors
```

| Symptom | Likely cause | Fix |
|---|---|---|
| Browser shows **Nginx welcome page** | Default site still enabled or your site not enabled | `sudo rm /etc/nginx/sites-enabled/default`, ensure the `floreat` symlink exists (16.4), `sudo nginx -t && sudo systemctl reload nginx`. |
| **502 Bad Gateway** at `/api/...` | Backend not running or crashed | `pm2 status`; if not `online`, `pm2 logs floreat-api`. Usually a bad `DATABASE_URL` or missing `CORS_ORIGIN`. Fix `.env`, then `pm2 restart floreat-api`. |
| Backend keeps **restarting / errored** with a CORS message | `NODE_ENV=production` but `CORS_ORIGIN` empty or `*` | Set `CORS_ORIGIN=http://YOUR_EC2_IP` (no trailing slash) in `backend/.env`, then `pm2 restart floreat-api`. |
| Backend log: **password authentication failed for user "floreat_user"** | Wrong DB password in `DATABASE_URL` | Reset it: `sudo -u postgres psql -c "ALTER USER floreat_user WITH PASSWORD 'newpass';"`, update `backend/.env`, `pm2 restart floreat-api`. |
| Prisma: **permission denied for schema public** | The schema grants in 9.2 were skipped | Re-run the `GRANT ALL ON SCHEMA public...` / `ALTER SCHEMA public OWNER...` lines as the `postgres` user, then `npm run db:migrate:deploy`. |
| Prisma: **Can't reach database server at 127.0.0.1:5432** | PostgreSQL not running | `sudo systemctl status postgresql`; start with `sudo systemctl enable --now postgresql`. |
| **403 Forbidden** loading the frontend | Nginx can't read `frontend/dist` | Re-run the `chmod o+x /home/ubuntu` and `chmod -R o+rX .../frontend/dist` from 16.3. |
| Frontend loads but **API calls fail / CORS error in console** | Frontend built with wrong `VITE_API_URL`, or mismatched origin | Ensure `frontend/.env` has `VITE_API_URL=` (empty), rebuild: `cd ~/floreat && npm run build`, then hard-refresh the browser. |
| **Blank white page**, console shows Clerk error | Missing/mismatched `VITE_CLERK_PUBLISHABLE_KEY` | Set it in `frontend/.env`, rebuild the frontend, hard-refresh. |
| `npm install` or `npm run build` **Killed** | Out of memory (t2.micro) | Add swap (6.4) and retry. |
| SSH **connection timed out** | Your IP changed / wrong Security Group | Update the SSH inbound rule to **My IP** (4.4). |
| Changes to code **don't show up** | Forgot to rebuild and/or restart | `cd ~/floreat && git pull && npm install && npm run build && pm2 restart floreat-api && sudo systemctl reload nginx`. |

**How to read the logs:** application-level bugs (bad SQL, unhandled errors, startup
crashes) appear in `pm2 logs`. Proxy/permission/port problems appear in Nginx's
`error.log`. Database service problems (won't start, disk full) appear in `journalctl -u
postgresql`.

---

<a name="21-maintenance"></a>
## 21. Basic server maintenance

Day-to-day operations you'll perform on the running server.

### 21.1 Viewing logs

```bash
pm2 logs floreat-api                 # live backend logs (Ctrl+C to exit)
pm2 logs floreat-api --lines 200     # last 200 lines
sudo tail -f /var/log/nginx/access.log   # who is hitting the site (live)
sudo tail -f /var/log/nginx/error.log    # Nginx errors (live)
sudo journalctl -u postgresql -f         # live database logs
```

### 21.2 Restarting services

```bash
pm2 restart floreat-api              # restart the app (after a rebuild)
sudo systemctl restart nginx        # restart the web server
sudo systemctl restart postgresql   # restart the database
```

- Prefer `sudo systemctl reload nginx` (no downtime) over `restart` when you only changed
  Nginx config.

### 21.3 Updating the application (deploying new code)
When new commits land on GitHub, update the server like this:

```bash
cd ~/floreat
git pull                     # fetch the latest code
npm install                  # install any new/changed dependencies
npm run build                # rebuild shared + frontend + backend
cd backend
npm run db:migrate:deploy    # apply any NEW database migrations
pm2 restart floreat-api      # restart the backend on the new code
cd ~/floreat
sudo systemctl reload nginx  # pick up the new frontend files
```

- **Why this order:** pull code → install deps → build → migrate DB → restart backend →
  reload Nginx (which now serves the freshly built `frontend/dist`).
- *Verify:* `pm2 status` shows `floreat-api` online, and `http://YOUR_EC2_IP` reflects the
  changes (hard-refresh the browser: **Ctrl+F5**).

> **Tip:** run `git pull` on a branch you trust. If a build fails, the previous backend
> keeps running under PM2 until you `pm2 restart`, so a failed build won't take the site
> down mid-way — but don't restart until the build succeeds.

### 21.4 Backing up the PostgreSQL database
Regular backups protect you from data loss and mistakes.

**Create a one-off backup:**

```bash
mkdir -p ~/backups
pg_dump "postgresql://floreat_user:YOUR_DB_PASSWORD@127.0.0.1:5432/floreat" \
  | gzip > ~/backups/floreat-$(date +%F-%H%M).sql.gz
```

- **`pg_dump`** exports the entire database as SQL. Piping through **`gzip`** compresses
  it. The filename embeds the date/time (e.g. `floreat-2026-07-12-1930.sql.gz`).
- *Verify:* `ls -lh ~/backups` shows a non-empty `.sql.gz` file.

**Automate a daily backup with cron:**

```bash
crontab -e     # choose nano if prompted
```

Add this line at the bottom (runs every day at 2:30 AM, keeps 7 days):

```cron
30 2 * * * pg_dump "postgresql://floreat_user:YOUR_DB_PASSWORD@127.0.0.1:5432/floreat" | gzip > /home/ubuntu/backups/floreat-$(date +\%F).sql.gz && find /home/ubuntu/backups -name '*.sql.gz' -mtime +7 -delete
```

- **Why:** automated, rotating backups mean you always have a recent copy without
  remembering to run it. The `find ... -mtime +7 -delete` prunes backups older than 7
  days so the disk doesn't fill. (Note the `\%` — cron treats `%` specially, so it must be
  escaped.)
- *Verify:* `crontab -l` shows your line. After the next run, a new file appears in
  `~/backups`.

> **Off-server copies:** backups on the same instance are lost if the instance dies. For
> real safety, periodically copy them off the box — e.g. `scp` them to your laptop, or
> `aws s3 cp ~/backups/... s3://your-bucket/` once you set up the AWS CLI. (Optional this
> phase.)

**Restoring from a backup (when needed):**

```bash
gunzip -c ~/backups/floreat-2026-07-12.sql.gz \
  | psql "postgresql://floreat_user:YOUR_DB_PASSWORD@127.0.0.1:5432/floreat"
```

- **What it does:** decompresses the dump and replays the SQL into the database.
- ⚠️ Restore onto an empty/fresh database or you may hit "already exists" conflicts.
  Test restores occasionally so you know they work *before* an emergency.

### 21.5 Routine OS updates

```bash
sudo apt update && sudo apt upgrade -y
```

- Run every week or two. If it says a reboot is required, schedule a `sudo reboot` (the
  stack auto-recovers per Section 18).

### 21.6 Watching disk and memory

```bash
df -h        # disk usage — watch the "/" filesystem's Use%
free -h      # RAM and swap usage
pm2 monit    # live CPU/memory for the backend
```

- **Why:** the two things that quietly break a small server are a **full disk** (logs,
  backups, npm caches) and **exhausted memory** during builds. Check these if the app gets
  slow or a build fails.

---

## Appendix — quick command reference

| Task | Command |
|---|---|
| SSH in | `ssh -i floreat-key.pem ubuntu@YOUR_EC2_IP` |
| Backend status | `pm2 status` |
| Backend logs | `pm2 logs floreat-api` |
| Restart backend | `pm2 restart floreat-api` |
| Reload Nginx | `sudo systemctl reload nginx` |
| Test Nginx config | `sudo nginx -t` |
| DB shell (admin) | `sudo -u postgres psql` |
| DB shell (app user) | `psql "postgresql://floreat_user:PW@127.0.0.1:5432/floreat"` |
| Apply migrations | `cd ~/floreat/backend && npm run db:migrate:deploy` |
| Full redeploy | `cd ~/floreat && git pull && npm install && npm run build && pm2 restart floreat-api && sudo systemctl reload nginx` |
| Backup DB | `pg_dump "postgresql://floreat_user:PW@127.0.0.1:5432/floreat" \| gzip > ~/backups/floreat-$(date +%F).sql.gz` |

**You're done.** Following these steps in order takes a fresh EC2 instance to a fully
running Floreat deployment (app + PostgreSQL on one server), reachable at
`http://YOUR_EC2_IP`, surviving reboots, with logging, updates, and backups in place. When
you're ready, the next phase is adding a domain name and HTTPS (Certbot/Let's Encrypt) and
switching Clerk to production keys.
