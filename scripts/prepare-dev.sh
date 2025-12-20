set -e

sed -i 's/jp.nonbili.jamu/jp.nonbili.jamu_dev/' app.config.ts
sed -i 's/Jamu/Jamu-dev/' app.config.ts
bun expo prebuild -p android --clean --no-install
