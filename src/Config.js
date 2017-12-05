let ApiUrl="";

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    ApiUrl = "http://localhost:56407/";
} else {
 //   ApiUrl = "https://stagingmaxtransliteapi.azurewebsites.net/"
    ApiUrl= "http://52.237.155.22/"
}

export { ApiUrl };