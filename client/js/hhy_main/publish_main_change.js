function changeBox(typeId) {
	document.getElementById('type1').style.display = 'none';
	document.getElementById('type2').style.display = 'none';
	document.getElementById('type3').style.display = 'none';
	document.getElementById(typeId).style.display = 'block';
}

function changeColor(btnid, isHover) {
	if (isHover) {
		document.getElementById('btn' + btnid).style.backgroundColor = '#ddd';
	} else {
		document.getElementById('btn' + btnid).style.backgroundColor = '#fff';
	}
}


