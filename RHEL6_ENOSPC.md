# ENOSPC - No space left on device

1. Il reste bel et bien de la place disponible mais plus d'inodes. Pour vérifier cela :
```ssh
df -i
```

2. Pour retrouver les fichiers fautifs:
```ssh
for i in /<path>/*; do echo $i; find $i |wc -l; done
```
