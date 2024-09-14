import React, { useState, useEffect } from "react";
import {
  TweetContainer,
  TweetHeader,
  TweetBody,
  TweetInfo,
  TweetActions,
  type TwitterComponents,
  EnrichedTweet,
  EntityWithType,
  User,
} from "react-tweet";

interface TweetPreviewProps {
  content: string;
}

export const TweetPreview: React.FC<TweetPreviewProps> = ({ content }) => {
  const [tweetContent, setTweetContent] = useState(
    "Hi Dan\n\nThis is a placeholder tweet with a $symbol. Edit the content to see it update here."
  );
  const [enrichedTweet, setEnrichedTweet] = useState<any | null>(null);

  useEffect(() => {
    if (content) {
      // Remove HTML tags, add default text, and limit to 280 characters for tweet
      const plainText = content.replace(/<[^>]*>/g, "");
      const defaultText = "Hi Dan\n\n";
      setTweetContent((defaultText + plainText).slice(0, 280));
    }
  }, [content]);

  useEffect(() => {
    const entities: EntityWithType[] = [
      {
        type: "text",
        start: 0,
        end: 6,
        symbol: "",
        text: content || "Hello World",
      },
    ];

    // addEntities(entities, 'symbol', tweet.entities.symbols)

    const user = {
      id_str: "987654321",
      name: "John Doe",
      screen_name: "johndoe",
      profile_image_url_https: "https://placekitten.com/48/48",
      verified: false,
    };

    const mockTweetData: EnrichedTweet = {
      id_str: "1234567890",
      created_at: new Date().toISOString(),
      url: "",
      user: user,
      like_url: "string",
      reply_url: "string",
      in_reply_to_url: "",
      entities: entities,
    };

    const enrichedMockTweet = {
      ...mockTweetData,
      __typename: "Tweet",
      lang: "en",
      favorite_count: 0,
      retweet_count: 0,
      reply_count: 0,
      quote_count: 0,
      conversation_id: mockTweetData.id_str,
      self_thread: {
        id_str: mockTweetData.id_str,
      },
      url: `https://twitter.com/${mockTweetData.user.screen_name}/status/${mockTweetData.id_str}`,
      user: {
        ...mockTweetData.user,
        url: `https://twitter.com/${mockTweetData.user.screen_name}`,
        follow_url: `https://twitter.com/intent/follow?screen_name=${mockTweetData.user.screen_name}`,
      },
      like_url: `https://twitter.com/intent/like?tweet_id=${mockTweetData.id_str}`,
      reply_url: `https://twitter.com/intent/tweet?in_reply_to=${mockTweetData.id_str}`,
      entities: mockTweetData.entities,
    };

    setEnrichedTweet(enrichedMockTweet);
  }, [tweetContent]);

  const components: Partial<TwitterComponents> = {};

  return (
    <div>
      {enrichedTweet && (
        <TweetContainer>
          <TweetHeader tweet={enrichedTweet} components={components} />
          <TweetBody tweet={enrichedTweet} />
          <TweetInfo tweet={enrichedTweet} />
          <TweetActions tweet={enrichedTweet} />
        </TweetContainer>
      )}
    </div>
  );
};
