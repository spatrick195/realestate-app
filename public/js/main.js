//modal
$(document).ready(function(){
    $("housemodal").on("show.bs.modal", function(event){
        var button = $(event.relatedTarget); // button that triggered modal
        var description = button.data("description");
        var image = button.data("image");
        var modal = $(this);

        modal.find(".modal-header > img").attr("src", image);
        modal.find(".modal-body").text(description);
    })
})