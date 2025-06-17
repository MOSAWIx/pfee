require('dotenv').config();
const App=require('./App');

// Port
const PORT = process.env.PORT || 5555;
// start Server
App.listen(PORT,'0.0.0.0',()=>{
    console.log(`Server is running on port ${PORT}`);
});
