// Dependencies
const fs = require('fs');
const path = require('path');

const lib = {};

// directory of .data folder
lib.baseDir = path.join(__dirname, '../.data/');

// Write data to file
lib.create = (dir, file, data, clbk) => {
    // open file for writing
    fs.open(
        lib.baseDir + dir + '/' + file + '.json',
        'wx',
        function (err, fileDescriptor) {
            if (!err && fileDescriptor) {
                // convert data to string
                const stringData = JSON.stringify(data);

                // write data to file and then close it.
                fs.writeFile(fileDescriptor, stringData, (err) => {
                    if (!err) {
                        fs.close(fileDescriptor, function (err) {
                            if (!err) {
                                clbk(false);
                            } else {
                                clbk('Error to close file');
                            }
                        });
                    } else {
                        clbk('error to writing to new file');
                    }
                });
            } else {
                clbk(
                    'Could not open file, it may already exists or dir not found :-('
                );
            }
        }
    );
};

// Read data from file
lib.read = (dir, file, clbk) => {
    fs.readFile(
        lib.baseDir + dir + '/' + file + '.json',
        'utf8',
        (err, data) => {
            clbk(err, data);
        }
    );
};

// Update existing file
lib.update = (dir, file, data, clbk) => {
    // open file for writing
    fs.open(
        lib.baseDir + dir + '/' + file + '.json',
        'r+',
        (err, fileDescriptor) => {
            if (!err && fileDescriptor) {
                // Convert object to json
                const jsonData = JSON.stringify(data);

                // truncet the file
                fs.ftruncate(fileDescriptor, (err) => {
                    if (!err) {
                        // update data to file and then close the file
                        fs.writeFile(fileDescriptor, jsonData, (err) => {
                            if (!err) {
                                fs.close(fileDescriptor, (err) => {
                                    if (!err) {
                                        clbk(false);
                                    } else {
                                        clbk(true);
                                    }
                                });
                            } else {
                                console.log('error occured to update file');
                            }
                        });
                    } else {
                        console.log('Error occure for trunced file');
                    }
                });
            } else {
                console.log('Error occured to update file');
            }
        }
    );
};

// Delete file
lib.delete = (dir, file, clbk) => {
    fs.unlink(lib.baseDir + dir + '/' + file + '.json', (err) => {
        if (!err) {
            clbk(false);
        } else {
            clbk(true, 'Error deleting file');
        }
    });
};

module.exports = lib;
