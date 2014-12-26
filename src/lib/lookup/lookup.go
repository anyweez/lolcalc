package lookup

/**
 * This package provides a very thin wrapper over the go-redis library
 * to shield the rest of the application logic from the choice of redis
 * as a datastore. If the need for search gets much more complicated then
 * Redis may not be a great match so it's better to keep it abstract for
 * now.
 */

import (
	"crypto/md5"
	"errors"
	"fmt"
	redis "github.com/go-redis/redis"
	"strconv"
	structs "structs"
)

var client *redis.Client

func init() {
	client = redis.NewClient(&redis.Options{
		Network: "tcp",
		Addr: "10.1.1.86:6379",
	})
}

/**
 * TODO: read in the requires inputs, pipe them into a hash function, and
 * retrieve the data that we need.
 */
func GetKey(input structs.StageCriteria) string {
	raw := strconv.Itoa(input.Gold) + "," + input.Champion.Name

	return fmt.Sprintf("%x", md5.Sum([]byte(raw)) )
}

func Get(key string) (string, error) {
	scmd := client.Get(key)
	
	if scmd.Err() != nil {
		return "", errors.New("Couldn't find simulation for requested champion: " + scmd.Err().Error())
	} else {
		return scmd.Val(), nil
	}
	
}

func Put(key string, value string) {
	client.Set(key, value)
}
