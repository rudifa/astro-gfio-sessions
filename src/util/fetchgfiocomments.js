
// export function fetchGfioCommwents that returns an array of json objects with the comments

export async function fetchGfioComments() {
    // return fetch('https://jsonplaceholder.typicode.com/comments')
    //     .then(response => response.json())
    //     .then(json => json);

    // simulate for now

    // console.log("fetchGfioComments called")

    return [
        {
            postId: 1,
            id: 1,
            name: "id labore ex et quam laborum",
            email: "",
            body: "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
            postId: 1,
            id: 2,
            name: "quo vero reiciendis velit similique earum",
            email: "",
            body: "est natus enim nihil est dolore omnis voluptatem numquam"
        },
        {
            postId: 1,
            id: 3,
            name: "odio adipisci rerum aut animi",
            email: "",
            body: "quia molestiae reprehenderit quasi aspernatur aut expedita"
        },
        {
            postId: 1,
            id: 4,
            name: "alias odio sit",
            email: "",
            body: "non et atque occaecati deserunt quas accusantium unde odit"
        },
        {
            postId: 1,
            id: 5,
            name: "vero eaque aliquid doloribus et culpa",
            email: "",
            body: "harum non quasi et ratione"
        }
    ];


}
