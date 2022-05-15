import React, {useState} from "react";

function MintForm(props) {
    const [owner, setOwner] = useState("");
    const [name, setName] = useState("");

    const handleOwnerTextFieldChange = (e) => {
        setOwner(e.target.value);
    }

    const handleNameTextFieldChange = (e) => {
        setName(e.target.value);
    }

    return (
        <div class="minterdiv">
          <p>Token's owner: <input id="owner" type="text" onChange={handleOwnerTextFieldChange}/></p>
          <p>Token's name: <input id="name" type="text" onChange={handleNameTextFieldChange}/></p>
          <p><button onClick={() => props.onClick(owner, name)}>Mint</button></p>
        </div>
    );
}

export default MintForm;