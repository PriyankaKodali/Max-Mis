let ApiUrl="";

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    ApiUrl = "http://localhost:56407/";
  // ApiUrl="http://localhost:60705/";
} else {
    ApiUrl = "https://stagingmaxtransliteapi.azurewebsites.net/"
}

export { ApiUrl };