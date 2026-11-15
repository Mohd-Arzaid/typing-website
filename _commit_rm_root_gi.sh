#!/bin/bash
set -e
git add -A
TREE=$(git write-tree)
PARENT=$(git rev-parse HEAD)
export GIT_AUTHOR_NAME="Mohd Arzaid"
export GIT_AUTHOR_EMAIL="arzaid0101030@gmail.com"
export GIT_COMMITTER_NAME="Mohd Arzaid"
export GIT_COMMITTER_EMAIL="arzaid0101030@gmail.com"
NEW=$(printf '%s\n' "Keep gitignore only inside frontend and backend packages." | git commit-tree "$TREE" -p "$PARENT")
git reset --hard "$NEW"
git log -1 --format='AUTHOR: %an <%ae>%n---%n%B---'
git status -sb
