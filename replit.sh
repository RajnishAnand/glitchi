if [[ $(node -v) != v16* ]]; then 
  npm install
  npm i node@16
  npm config set prefix=$(pwd)/node_modules/node
  export PATH=$(pwd)/node_modules/node/bin:$PATH
fi
npm start