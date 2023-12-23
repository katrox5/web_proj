function openModal() {
	var modal = document.getElementById('customModal');
	modal.style.display = 'flex';
}

function closeModal() {
	var modal = document.getElementById('customModal');
	modal.style.display = 'none';
}
function logoout(){
	closeModal();
	localStorage.setItem('id',-1);
	localStorage.setItem('autolog', false);
	
}