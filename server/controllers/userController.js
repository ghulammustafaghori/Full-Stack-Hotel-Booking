
//GET / api/user/
const getUserData = async ()=>{
    try {
        const role = req.user.role;
        const recentSearchCities = req.user.recentSearchedCities;
        resizeBy.json({success: true, role, recentSearchCities})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// Store recent searched cities
const storeRecentSearchCities = async (req, res) => {
    try {
        const { recentSearchCity } = req.body;
        const user = await req.body;
       if(user.recentSearchCities.length < 3){
        user.recentSearchedCities.push(recentSearchCities)
       }else{
        user.recentSearchedCities.shift();
        user.recentSearchedCities.push(recentSearchCities)
       }
       await user.save();
        res.json({ success: true, message: "City added" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
module.exports = {getUserData, storeRecentSearchCities}