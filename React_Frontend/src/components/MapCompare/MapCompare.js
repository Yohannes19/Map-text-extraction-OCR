function calculateLevenshteinDistance(a, b) {
    const matrix = [];
  
    // Initialize the matrix
    for (let i = 0; i <= a.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= b.length; j++) {
      matrix[0][j] = j;
    }
    // Calculate the Levenshtein distance
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
  
    return matrix[a.length][b.length];
  }
  
  function compareTexts(originalText, reproducedText) {
    // Calculate the Levenshtein distance between the texts
    const distance = calculateLevenshteinDistance(originalText, reproducedText);
  
    // Define a threshold for similarity (you can adjust this)
    const similarityThreshold = 0.9; // For example, texts within 20% edit distance are considered similar
  
    // Calculate the similarity score
    const similarityScore = 1 - distance / Math.max(originalText.length, reproducedText.length);
  
    // Compare the similarity score to the threshold
    if (similarityScore >= similarityThreshold) {
      return 'The map is reproducible';
    } else {
      return 'The map is not reproducible';
    }
  }
  
  const result = compareTexts(extractedOGText, extractedRPText);

  {extractedOGTextBB.length > 0 && (
    <table >
      <thead>
        <tr>
          <th>Original Text</th>
          <th>Reproduced Text</th>
        </tr>
      </thead>
      <tbody>
        {extractedOGTextBB.map((ogText, index) => (
          <tr key={index}>
            
            <td>{ogText[1]}</td>
            <td>{extractedRPTextBB[index][1]}</td>
          </tr>
        ))}
      </tbody>
    </table>
    
    )}
    //annotated image urls
          //const extractedOGURL = extimgurls.original_img_url;
          //const extractedRPURL = extimgurls.reproduced_img_url
          //original and reproduced texts
         // const extractedOGTexts=extTexts.original_texts
          //const extractedRPTexts=extTexts.reproduced_texts
          //Original and reproduced textsBB
          //const extractedOGTextsBB=Text_BBs.original_list
          //const extractedRPTextsBB=Text_BBs.reproduced_list
          
           // console.log(extractedOGTextsBB)
            //console.log(extractedRPTextsBB)
          //Setting the text-states for update
         // setExtractedOGText(extractedOGTexts)
        //setExtractedRPText(extractedRPTexts)
      //Setting the BB_Text for update
         // setExtractedOGTextBB(extractedOGTextsBB)
          //setExtractedRPTextBB(extractedRPTextsBB)
           //const extimgurls=response.data.image_url[0]
           
          //const extTexts=response.data.Texts[0]
          //const Text_BBs=response.data.Texts_BBS[0]
         /* const handleUploadClick = async () => {
            try {
          
              // Check if there are uploaded files
              if (Array.isArray(original) && original.length > 0 && Array.isArray(reproduced) && reproduced.length > 0) {
                
                const originalImage = new Image();
                const reproducedImage = new Image();
          
                originalImage.src = URL.createObjectURL(original[0]);
                reproducedImage.src = URL.createObjectURL(reproduced[0]);
          
                originalImage.onload = () => {
                  reproducedImage.onload = () => {
                    if (
                      originalImage.width === reproducedImage.width &&
                      originalImage.height === reproducedImage.height
                    ) {
                      const msg="Dimensions are the same. You can proceed"
                      setMessage(msg)
                      console.log("Dimensions are the same. You can proceed.");
                    
                        const formData = new FormData();
                        original.forEach((file) => {
                          formData.append("original", file);
                        });
                        reproduced.forEach((file) => {
                          formData.append("reproduced", file);
                        });
                        setLoading(true);
                        //Image comparsion in the browser
                        // Make a POST request to your Flask API endpoint
                        const response = await axios.post("http://localhost:5000/upload-and-extract", formData, {
                          headers: {
                            "Content-Type": "multipart/form-data" // Set the correct content type for file uploads
                          }
                        });
                  
                  setLoading(false);
                  if(response.data.message){
                    const message =response.data.message
                    setMessage(message)
                    
                  }
                  else{
                  //console.log(response.data.matching_results)
                      if (response && response.data && Array.isArray(response.data.matching_Results)) {
                    const comparsion_lists=response.data.matching_Results
                    //setMatchingResults(comparsion_lists);
                    setResults(comparsion_lists)
                   
                    //console.log(comparsion_lists) 
                    setIsModalOpen(true);
                  }
                 else{
                  const serverInfo="The server response is Invalid,Please try again"
                  setMessage(serverInfo)
                  setLoading(false)
                  //console.error("Response data is invalid");
                   }
                }
              }
              else {
                      // Dimensions are different; you can show an error message
                      console.log("Dimensions are different. Show an error message.");
                      const msg="Dimensions are different. Show an error message"
                      setMessage(msg)
                    } 
                  };
                };
              }
               else
              {
                const info="Please select files to upload!,"
                setMessage(info)
                setLoading(false)
              }
            } catch (error) {
              setLoading(false);
              
              if(error.response){
                console.log(error.response.data)
                setMessage(error.response.data.message)
              }
              else{
                console.error('Error:', error.message);
              }
            }
          }*/