# Configuring the Default RHEL 6 Runlevel
---

The default runlevel for an RHEL system is defined within the /etc/inittab file. To identify the current default level or change the default to a different setting, load this file into an editor (keeping in mind that root privileges will be required).
The relevant section of a sample /etc/inittab file is as follows:
```
# Default runlevel. The runlevels used by RHS are:
#   0 - halt (Do NOT set initdefault to this)
#   1 - Single user mode
#   2 - Multiuser, without NFS (The same as 3, if you do not have networking)
#   3 - Full multiuser mode
#   4 - unused
#   5 - X11
#   6 - reboot (Do NOT set initdefault to this)
#
id:3:initdefault:
```

### Identifying Services that Start at Each Runlevel
```ssh
/sbin/chkconfig --list
```

### Changing the Services for a Runlevel
```ssh
/sbin/chkconfig --level 5 $service$ on
```
