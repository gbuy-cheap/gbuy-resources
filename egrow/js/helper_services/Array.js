/**
 * Provides helper functions for arrays
 * @type {{flip}}
 */
Helper.array = (function () {
    return {
        flip: function (array) {
            const tmpArray = [];
            $.each(array, function (index, value) {
                tmpArray[value] = index;
            });
            return tmpArray;
        },
        clean: function (array) { // function to remove. 'null', '0', '""', 'false', 'undefined' and 'NaN' values from an array
            let index = -1;
            const arr_length = array ? array.length : 0;
            let resIndex = -1;
            const result = [];

            while (++index < arr_length) {
                var value = array[index];

                if (value != null) {
                    result[++resIndex] = value;
                }
            }

            return result;
        }
    };
}());
