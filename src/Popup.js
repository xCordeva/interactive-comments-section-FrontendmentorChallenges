const Popup = ({handleDelete, deleteClicked, toggleDeleteClick}) => {

    return (
        <div className="popup" style={ {display: deleteClicked  ? 'flex' : 'none'} } >
            <div className="popup-content">
                <h2>Delet Comment</h2>
                <p>Are you sure you want to delete this comment?
                    This will remove the comment and can't be undone.
                </p>
                <div className="buttons">
                    <button className="cancel-button" onClick={()=>{
                    toggleDeleteClick()}} >NO, CANCEL</button>
                    <button className="delete-button" onClick={handleDelete}>YES, DELETE</button>
                </div>
                
            </div>
        </div>
    );
}
 
export default Popup;