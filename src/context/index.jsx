import { createContext, useDebugValue, useState } from "react";
import { useNavigate } from "react-router-dom";

export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
  const [searchParam, setSearchParam] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipeList, setRecipeList] = useState([]);
  const [recipeDetailsData, setRecipeDetailsData] = useState(null);
  const [favouritesList, setFavouritesList] = useState([])

  const navigate = useNavigate()

    async function handleSubmit(event){
        // dont refresh page
        event.preventDefault()
        try{
            const response = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchParam}`);
            const data = await response.json();
            if(data?.data?.recipes){
                setRecipeList(data?.data?.recipes)
                setLoading(false)
                setSearchParam('')
                navigate('/')
            }
            console.log(data)
        } catch (error) {
            console.log(error)
            setLoading(false)
            setSearchParam('')
        }
    }


    function handleAddToFavourites(getCurrentItem){
        console.log(getCurrentItem)
        let copyFavourites = [...favouritesList];
        const index = copyFavourites.findIndex(item=> item.id === getCurrentItem.id)

        if(index === -1){
            copyFavourites.push(getCurrentItem)
        }else{
            copyFavourites.splice(index)
        }

        // update list
        setFavouritesList(copyFavourites)
    }

    console.log(favouritesList, 'favouritesList')

  return (
    <GlobalContext.Provider value={{ searchParam, loading, recipeList, recipeDetailsData, favouritesList, handleAddToFavourites, setRecipeDetailsData, setSearchParam, handleSubmit }}>
      {children}
    </GlobalContext.Provider>
  );
}
