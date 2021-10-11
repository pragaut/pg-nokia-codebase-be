/**
 * while breaking the csv content the biggest problem is how to handle the carriage returns and commas in the data.
 * 
 * The CSV maker always converts these texts into double quotes however, the problem is, that customer can also use double quotes so we need to 
 * 
 * 1. first replace the existing double quotes with a keyword,
 * 2. break the line with comma but the text in double quotes should not split
 * 3. replace the keyword back to double quotes
 */

const doubleQuotesKeyword = '-dqrw-ms-d-ka-'
const doubleQuotesSeparator_start = '-dq-s-n-ow-'
const doubleQuotesContentReplacer = '-re-p-m-e-noql-'

const splitTextLine = line => {
    const replacedTexts = [];
    // first replace the single quotes
    const line_no_sq = line.split('\'').join('\'\''); 
    const line_no_sq_dq = line_no_sq.split('""').join(doubleQuotesKeyword); 

    let line_no_sq_dq_split_start = line_no_sq_dq.split(',"').join(',' + doubleQuotesSeparator_start);
    const line_no_sq_dq_split_start_array = line_no_sq_dq_split_start.split(',' + doubleQuotesSeparator_start);

    // always skip the first row, start with second

    line_no_sq_dq_split_start_array.forEach((content, index) => {
        if (index > 0) {
            // skipped first element

            // let's split it with the end separator
            const line_no_sq_dq_split_end = content.split('",'); //.join(doubleQuotesSeparator_end);
            
            // it should always split the text into two parts, if one then it is a straight flush to buffer
            
            if (line_no_sq_dq_split_end.length > 0) {
                const newText = doubleQuotesContentReplacer + '-' + replacedTexts.length;

                replacedTexts.push(line_no_sq_dq_split_end[0]);
                line_no_sq_dq_split_start = line_no_sq_dq_split_start.replace(line_no_sq_dq_split_end[0], newText);
            }
        }
    });

    //let's split from comma

    const content_after_split = line_no_sq_dq_split_start.split(',');

    // data is split, let's just replace the content and reverse engineer things

    let incrementor = 0;

    const final_content_to_deliver = content_after_split.map((item, index) => {
        const key = doubleQuotesContentReplacer + '-' + incrementor;
        let item_clonned = item;

        if (item.indexOf(key) > -1) {
            item_clonned = item.replace(key, replacedTexts[incrementor]);
            incrementor++;
        }

        item_clonned = item_clonned.split(doubleQuotesKeyword).join('"');
        item_clonned = item_clonned.split(doubleQuotesSeparator_start).join('');
        return item_clonned;
    });

    return final_content_to_deliver;
};

module.exports.splitTextLine = splitTextLine;
