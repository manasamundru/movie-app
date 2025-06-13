export function Search({searchTerm,setSearchTerm}){
    return(
    <div className="search">
        <div>
            <img src = "/Search-Input.svg" alt = "search"/>
            <input type="text"placeholder="Search through thousands of movies"
            value={searchTerm}
            onChange={(event)=>setSearchTerm(event.target.value)}></input>
        </div>
    </div>
    )
}