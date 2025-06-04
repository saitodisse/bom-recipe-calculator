# 21 cd site
#   22 git status
#   23 git add .
#   24 git commit -m"update jsr:@saitodisse/bom-recipe-calculator"
#   25 git push
#   26 cd ..
#   27 deno task test
#   28 cd site
#   29 deno add jsr:@saitodisse/bom-recipe-calculato

cd site
deno add jsr:@saitodisse/bom-recipe-calculator
git add .
git commit -m"update jsr:@saitodisse/bom-recipe-calculator"
git push
deno task start
cd ..
