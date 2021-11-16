import ejs from 'ejs';

export const getHTMLFile = async (path, data) => {
    console.log("Llega al getHTL");
    console.log(data);
  const source = await ejs.renderFile(path, data);
  console.log(source);
  return source;
};


