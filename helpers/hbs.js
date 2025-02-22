const { findByIdAndDelete } = require("../models/User")

module.exports = {
    editIcon: function (visitUser, loggedUser, visitId) {
        if (visitUser._id.toString() == loggedUser._id.toString()) {
            return `<a href="/visits/edit/${visitId}" class="btn btn-sm px-2"><i class="fas fa-edit"></i></a>`
        } else {
            return ''
        }
    },
    deleteIcon: function (visitUser, loggedUser) {
        if (visitUser._id.toString() == loggedUser._id.toString()) {
            return `<button type="submit" class="btn btn-sm px-2"><i class="fas fa-trash"></i></button>`
        } else {
            return ''
        }
    },
    select: function (selected, options) {
        return options .fn(this)
        .replace(
            new RegExp(' value="' + selected + '"'),
            '$& selected="selected"'
        )
        .replace(
            new RegExp('>' + selected + '</option>'),
            ' selected="selected"$&'
        )
    }
}