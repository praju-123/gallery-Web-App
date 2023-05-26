export const fetchImages = async () => {
  const response = await fetch(
    `https://api.unsplash.com/photos/?client_id=oiqH4zrZIKZzNv55uENlzKvk8bac9SOB6PYBbZ7uX5w`
  );
  const data = await response.json();
  return data;
};
