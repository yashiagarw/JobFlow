export const catchAsyncErrors = (a)=>{ //here a is function
    return (req,res,next) => {
        Promise.resolve(a(req,res,next)).catch(next); //if any error occurs in function a it will be caught by catch and passed to next middleware
    }
}